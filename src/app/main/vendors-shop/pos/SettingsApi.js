import { apiService as api } from 'app/store/apiService';

export const addTagTypes = [
	'settings_account',
	'settings_notification',
	'settings_security',
	'settings_plan_billing',
	'settings_team',
	'settings_team_member'
];
const injectedRtkApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getAccountSettings: build.query({
				query: () => ({ url: `/mock-api/settings/account` }),
				providesTags: ['settings_account']
			}),
			updateAccountSettings: build.mutation({
				query: (queryArg) => ({
					url: `/mock-api/settings/account`,
					method: 'PUT',
					data: queryArg
				}),
				invalidatesTags: ['settings_account']
			}),
			getNotificationSettings: build.query({
				query: () => ({ url: `/mock-api/settings/notifications` }),
				providesTags: ['settings_notification']
			}),
			updateNotificationSettings: build.mutation({
				query: (queryArg) => ({
					url: `/mock-api/settings/notifications`,
					method: 'PUT',
					data: queryArg
				}),
				invalidatesTags: ['settings_notification']
			}),
			getSecuritySettings: build.query({
				query: () => ({ url: `/mock-api/settings/security` }),
				providesTags: ['settings_security']
			}),
			updateSecuritySettings: build.mutation({
				query: (queryArg) => ({
					url: `/mock-api/settings/security`,
					method: 'PUT',
					data: queryArg
				}),
				invalidatesTags: ['settings_security']
			}),
			getPlanBillingSettings: build.query({
				query: () => ({ url: `/mock-api/settings/plan-billing` }),
				providesTags: ['settings_plan_billing']
			}),
			updatePlanBillingSettings: build.mutation({
				query: (queryArg) => ({
					url: `/mock-api/settings/plan-billing`,
					method: 'PUT',
					data: queryArg
				}),
				invalidatesTags: ['settings_plan_billing']
			}),
			getTeamMembersSettings: build.query({
				query: () => ({ url: `/mock-api/settings/team` }),
				providesTags: ['settings_team']
			}),
			createTeamMemberSettings: build.mutation({
				query: (queryArg) => ({
					url: `/mock-api/settings/team`,
					method: 'POST',
					data: queryArg
				}),
				invalidatesTags: ['settings_team']
			}),
			deleteTeamMemberSettings: build.mutation({
				query: (queryArg) => ({
					url: `/mock-api/settings/team/${queryArg.memberId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['settings_team_member']
			}),
			updateTeamMemberSettings: build.mutation({
				query: (queryArg) => ({
					url: `/mock-api/settings/team`,
					method: 'PUT',
					data: queryArg
				}),
				invalidatesTags: ['settings_team']
			})
		}),
		overrideExisting: false
	});
export { injectedRtkApi as SettingsApi };
export const {
	useGetAccountSettingsQuery,
	useUpdateAccountSettingsMutation,
	useGetNotificationSettingsQuery,
	useUpdateNotificationSettingsMutation,
	useGetSecuritySettingsQuery,
	useUpdateSecuritySettingsMutation,
	useGetPlanBillingSettingsQuery,
	useUpdatePlanBillingSettingsMutation,
	useGetTeamMembersSettingsQuery,
	useCreateTeamMemberSettingsMutation,
	useDeleteTeamMemberSettingsMutation,
	useUpdateTeamMemberSettingsMutation
} = injectedRtkApi;
