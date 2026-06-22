interface SkeletonShimmerProps {
  width?: string
  height?: string
  className?: string
}

/**
 * Renders a shimmer loading placeholder.
 * Used instead of spinners for all loading states.
 * @param width - CSS width value
 * @param height - CSS height value
 * @param className - Additional CSS classes
 */
export function SkeletonShimmer({ width = '100%', height = '20px', className = '' }: SkeletonShimmerProps) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{ width, height }}
    />
  )
}

/**
 * Skeleton placeholder for a proposal card during loading.
 */
export function ProposalCardSkeleton() {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      borderRadius: '2px',
      padding: '24px',
    }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <SkeletonShimmer width="100px" height="22px" />
        <SkeletonShimmer width="80px" height="22px" />
      </div>
      <SkeletonShimmer width="80%" height="28px" className="" />
      <div style={{ marginTop: '16px' }}>
        <SkeletonShimmer width="100%" height="16px" />
        <div style={{ marginTop: '8px' }}>
          <SkeletonShimmer width="90%" height="16px" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
        <div>
          <SkeletonShimmer width="40px" height="14px" />
          <SkeletonShimmer width="100%" height="14px" className="" />
          <SkeletonShimmer width="100%" height="14px" className="" />
          <SkeletonShimmer width="100%" height="14px" className="" />
        </div>
        <div>
          <SkeletonShimmer width="60px" height="14px" />
          <SkeletonShimmer width="100%" height="14px" className="" />
          <SkeletonShimmer width="100%" height="14px" className="" />
          <SkeletonShimmer width="100%" height="14px" className="" />
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton placeholder for a leaderboard row during loading.
 */
export function LeaderboardRowSkeleton() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '60px 1fr 120px 100px 100px',
      gap: '16px',
      padding: '12px 16px',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <SkeletonShimmer width="30px" height="18px" />
      <SkeletonShimmer width="140px" height="18px" />
      <SkeletonShimmer width="80px" height="18px" />
      <SkeletonShimmer width="50px" height="18px" />
      <SkeletonShimmer width="50px" height="18px" />
    </div>
  )
}

/**
 * Skeleton placeholder for a history row during loading.
 */
export function HistoryRowSkeleton() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '16px',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <SkeletonShimmer width="200px" height="18px" />
      <SkeletonShimmer width="60px" height="18px" />
      <SkeletonShimmer width="80px" height="18px" />
      <SkeletonShimmer width="80px" height="18px" />
    </div>
  )
}
