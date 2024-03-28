import {relationEnums} from "@/enums/enums";

export function getFollowable(user) {
    return user.relation !== relationEnums.FOLLOW && user.relationReverse !== relationEnums.BLOCK && user.relation !== relationEnums.BLOCK;
}

export function getProfileViewable(user) {
    return user.relation !== relationEnums.BLOCK && user.relationReverse !== relationEnums.BLOCK;
}