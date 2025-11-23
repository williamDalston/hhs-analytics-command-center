import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded',
  className = '',
  animate = true
}) => {
  return (
    <motion.div
      className={`${width} ${height} ${rounded} bg-slate-200 dark:bg-slate-700 ${className}`}
      animate={animate ? {
        opacity: [0.5, 1, 0.5],
      } : {}}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );
};

const SkeletonCard = ({ lines = 3, showAvatar = false, className = '' }) => {
  return (
    <div className={`card p-4 space-y-3 ${className}`}>
      {showAvatar && (
        <div className="flex items-center gap-3">
          <Skeleton width="w-10" height="h-10" rounded="rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton width="w-1/3" height="h-4" />
            <Skeleton width="w-1/2" height="h-3" />
          </div>
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, i) => (
          <Skeleton key={i} width={i === lines - 1 ? 'w-3/4' : 'w-full'} />
        ))}
      </div>
    </div>
  );
};

const SkeletonList = ({ items = 5, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }, (_, i) => (
        <SkeletonCard key={i} lines={2} showAvatar={false} />
      ))}
    </div>
  );
};

const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b border-slate-200">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={i} width="w-20" height="h-4" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-2">
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton
              key={colIndex}
              width={colIndex === 0 ? 'w-32' : 'w-24'}
              height="h-4"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export { Skeleton, SkeletonCard, SkeletonList, SkeletonTable };
export default Skeleton;



