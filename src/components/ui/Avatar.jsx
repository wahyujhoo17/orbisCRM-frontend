import React from 'react';

export default function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  className = ''
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium ${className}`}>
      {name ? getInitials(name) : '?'}
    </div>
  );
}

export function AvatarGroup({ avatars = [], max = 3, size = 'md' }) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          {...avatar}
          size={size}
          className="border-2 border-white"
        />
      ))}
      {remainingCount > 0 && (
        <div className={`${size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-xs font-medium border-2 border-white`}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
