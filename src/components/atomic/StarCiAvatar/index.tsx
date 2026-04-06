import {
  Avatar,
  AvatarGroup,
  AvatarGroupProps,
  AvatarProps,
} from "@heroui/react";
import React from "react";

export const StarCiAvatar = (props: AvatarProps) => {
  return <Avatar {...props} />;
};

export const StarCiAvatarGroup = (props: AvatarGroupProps) => {
  return <AvatarGroup {...props} />;
};
