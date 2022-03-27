import express from "express";
import Friend from "../model/friend.model";
import User from "../model/user.model";

type FriendType = {
    userId: number;
    phone: string;
};

type FriendSearchType = {
    phone: string;
};

const router = express.Router();

router.get('/search', async (req, res) => {
    const { phone } = req.query as FriendSearchType;
    if (!phone) {
        return res.status(400).json();
    }

    const foundUser: User | null = await User.findOne(
        {
            where:
            {
                phone: phone
            }
        }
    );
    if (!foundUser) {
        return res.status(404).json();
    }

    return res.status(200).json(foundUser);
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json();
    }

    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(400).json();
    }

    const friends = await user.$get("myFriends", {
        include: [
            {
                model: User
            },
        ],
    });

    const friendList = friends.map((friend) => {
        return friend.getDataValue("friendUser");
    });

    return res.status(200).json(friendList);
});

router.post('/', async (req, res) => {
    const { userId, phone } = req.body as FriendType;
    // 사용자 ID 및 휴대전화번호 미입력 경우
    if (!userId || !phone) {
        return res.status(400).json({
            message: "올바른 요청이 아닙니다."
        });
    }

    // 사용자는 ID를 기준으로 DataBase에서 찾기
    const user: User | null = await User.findByPk(userId);
    // 사용자가 없는 경우 및 본인 전화번호를 입력한 경우
    if (!user || user.phone === phone) {
        return res.status(400).json({
            message: "잘못된 사용자 요청입니다."
        });
    }

    // 친구 사용자는 phone을 기준으로 Database에서 찾기
    const friendUser: User | null = await User.findOne(
        {
            where:
            {
                phone: phone
            }
        }
    );
    // 친구가 사용자가 아닌 경우
    if (!friendUser) {
        return res.status(404).json({
            message: "등록되지 않은 사용자입니다."
        });
    }

    // 친구 관계인지 찾기
    const isAlreadyFriend: Friend | null = await Friend.findOne(
        {
            where:
            {
                userId: user.id,
                friendId: friendUser.id,
            }
        }
    );
    // 이미 친구 관계인 경우
    if (isAlreadyFriend) {
        return res.status(400).json({
            message: "이미 친구인 상태입니다."
        });
    }

    await Friend.create({
        userId: user.id,
        friendId: friendUser.id
    });

    return res.status(201).json({
        message: `${friendUser.name}와(과) 친구 추가가 완료되었습니다.`
    });
});

export default router;