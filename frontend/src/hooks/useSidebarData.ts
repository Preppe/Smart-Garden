import { useGetUserGardensQuery } from '@/graphql/generated/types';
import { useAuthStore } from '@/stores/authStore';

export const useSidebarData = () => {
  const { user } = useAuthStore();
  const { data } = useGetUserGardensQuery({
    skip: !user,
  });

  const gardens = data?.getUserGardens || [];

  // Calculate totals
  const gardensCount = gardens.length;
  const cultivationsCount = gardens.reduce((total, garden) => total + (garden.cultivations?.length || 0), 0);

  return {
    gardensCount,
    cultivationsCount,
  };
};
