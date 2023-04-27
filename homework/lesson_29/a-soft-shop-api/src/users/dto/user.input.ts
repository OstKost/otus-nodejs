import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserInput {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  role?: string;
}
