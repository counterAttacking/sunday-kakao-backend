import { AllowNull, AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table
export default class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: bigint;

    @AllowNull(false)
    @Column(DataType.STRING(20))
    name: string;

    @AllowNull(false)
    @Column(DataType.STRING(20))
    phone: string;

    @AllowNull(true)
    @Default("")
    @Column(DataType.STRING(100))
    statusMessage: string;
}