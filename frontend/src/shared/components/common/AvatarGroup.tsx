import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/shared/components/ui/avatar";

interface UserAvatar {
  avatar?: string;
}

interface UsersAvatarGroupProps {
  users?: UserAvatar[];
  count?: number;
  className?: string;
}

const UsersAvatarGroup = ({
  users = [],
  count = 0,
  className = "",
}: UsersAvatarGroupProps) => {
  return users.length > 0 ? (
    <AvatarGroup className="grayscale">
      {(users.length > 3 ? users.slice(0, 3) : users).map((user, idx) => (
        <Avatar key={idx} className={`w-6 h-6 ${className}`}>
          <AvatarImage src={user.avatar} alt="user" />
          <AvatarFallback>User</AvatarFallback>
        </Avatar>
      ))}
      {users.length > 3 && (
        <AvatarGroupCount className={`w-6 h-6 ${className}`}>
          +{users.length - 3}
        </AvatarGroupCount>
      )}
    </AvatarGroup>
  ) : count > 0 ? (
    <AvatarGroup className="grayscale">
      {Array.from({
        length: count > 3 ? 3 : count,
      }).map((_, idx) => (
        <Avatar key={idx} className={`w-6 h-6 ${className}`}>
          <AvatarImage src="/images/empty-user-avatar.png" alt="member" />
          <AvatarFallback>User</AvatarFallback>
        </Avatar>
      ))}
      {count > 3 && (
        <AvatarGroupCount className={`w-6 h-6 ${className}`}>
          +{count - 3}
        </AvatarGroupCount>
      )}
    </AvatarGroup>
  ) : (
    <div>0 Users</div>
  );
};

export default UsersAvatarGroup;
