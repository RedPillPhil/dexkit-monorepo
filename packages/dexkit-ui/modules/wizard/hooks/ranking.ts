import { useQuery } from "@tanstack/react-query";
import { myAppsApi } from "../../../constants/api";

export const GET_APP_RANKINGS_QUERY = 'GET_APP_RANKINGS_QUERY'

export function useAppRankingListQuery({
  siteId,
  page = 0,
  pageSize = 10,
  sort,

  filter,
}: {

  page?: number;
  pageSize?: number;
  siteId?: number;
  sort?: string[];
  filter?: any;
}) {

  return useQuery<{
    data: {
      id: number;
      title: string;
      description: string;
    }[];
    skip?: number;
    take?: number;
    total?: number;
  }>(
    [GET_APP_RANKINGS_QUERY, sort, page, pageSize, filter, siteId],
    async () => {
      if (!siteId) {
        return { data: [] };
      }


      return (
        await myAppsApi.get<{
          data: {
            id: number;
            title: string;
            description: string;
          }[];
          skip?: number;
          take?: number;
          total?: number;
        }>(`/site-ranking/all/${siteId}`, {
          params: { skip: page * pageSize, take: pageSize, sort, filter: filter ? JSON.stringify(filter) : undefined },
        })
      ).data;

    }
  );
}

export const GET_APP_RANKING_QUERY = 'GET_APP_RANKING_QUERY'
export function useAppRankingQuery({
  rankingId,
  filter,
}: {
  filter?: any;
  rankingId?: number;

}) {

  return useQuery<{
    ranking?: {
      id: number;
      title: string;
      description: string;
    },
    data: {
      account: string;
      points: number;
    }[];
  }>(
    [GET_APP_RANKING_QUERY, rankingId],
    async () => {
      if (!rankingId) {
        return { data: [] };
      }

      return (
        await myAppsApi.get<{
          ranking: {
            id: number;
            title: string;
            description: string;
          },
          data: {
            account: string;
            points: number;
          }[];
          skip?: number;
          take?: number;
          total?: number;
        }>(`/site-ranking/ranking/${rankingId}`, {
          params: { filter: filter ? JSON.stringify(filter) : undefined },
        })
      ).data;

    }
  );
}