import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({
        type: String,
        required: true,
        length: 20,
        max_length: 20,
        minlength: 3,
    })
    name: string;

    @Prop({
        required: true,
        unique: true,
        type: String,
        length: 20,
        max_length: 20,
        minlength: 13,
        validate: {
            validator: (v: string) => {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            }
        },

    })
    email: string;

    @Prop({
        type: String,
        length: 16,
    })
    mobile: string;

    @Prop({
        type: [String],
        required: true,
        default: ["Client"],
    })
    role: [String];

    @Prop({
        required: true,
        type: String,
        length: 20,
        max_length: 20,
        minlength: 5,
    })
    password: string;

    @Prop({
        type: Number,
        length: 3,
        max_length: 3,
        minlength: 1,
    })
    age: number;

    @Prop()
    avatar: string;

    @Prop({type: Object})
    address: Object;

    @Prop()
    createdAt?: Date
  
    @Prop()
    updatedAt?: Date
}

export const UserSchema = SchemaFactory.createForClass(User);
