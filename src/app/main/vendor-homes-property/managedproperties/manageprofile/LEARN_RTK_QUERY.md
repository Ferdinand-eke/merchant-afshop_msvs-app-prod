# Understanding RTK Query - A Learning Guide

This file explains the RTK Query implementation that was initially created for the property profile API calls, and why the naming conventions might seem confusing at first.

## What is RTK Query?

RTK Query is a powerful data fetching and caching tool built into Redux Toolkit. It's designed to simplify API calls in React applications by automatically generating hooks and managing cache/state for you.

## The Original Implementation (ProfileApi.js)

Here's how the RTK Query API was set up:

```javascript
import { apiService as api } from 'app/store/apiService';

const baseUrl = 'http://localhost:8000';

export const addTagTypes = [
	'inspection_schedules',
	'property_offers',
	'property_acquisitions'
];

const ProfileApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			// Endpoint definition
			getInspectionSchedules: build.query({
				query: () => ({
					url: `${baseUrl}/inspection-schedules/merchant/schedules`,
					method: 'GET'
				}),
				providesTags: ['inspection_schedules']
			}),

			// Mutation example
			declineOffer: build.mutation({
				query: ({ offerId, rejectionReason }) => ({
					url: `${baseUrl}/realestate-offers/merchant/decline/${offerId}`,
					method: 'PUT',
					body: { rejectionReason }
				}),
				invalidatesTags: ['property_offers']
			})
		}),
		overrideExisting: false
	});

export default ProfileApi;

// Auto-generated hooks - THIS IS WHERE THE CONFUSION HAPPENS!
export const {
	useGetInspectionSchedulesQuery,  // Query becomes "use[Name]Query"
	useDeclineOfferMutation           // Mutation becomes "use[Name]Mutation"
} = ProfileApi;
```

## Why The Names Change - The Confusion Explained

### The Naming Convention

RTK Query automatically generates React hooks from your endpoint definitions using this pattern:

**For Queries (GET requests):**
- Endpoint name: `getInspectionSchedules`
- Generated hook: `useGetInspectionSchedulesQuery`
- Pattern: `use` + `[EndpointName]` + `Query`

**For Mutations (POST/PUT/DELETE requests):**
- Endpoint name: `declineOffer`
- Generated hook: `useDeclineOfferMutation`
- Pattern: `use` + `[EndpointName]` + `Mutation`

### Example Breakdown

```javascript
// 1. You define the endpoint with this name:
getPropertyOffers: build.query({
	query: ({ propertyId, page, limit }) => ({ ... })
})

// 2. RTK Query automatically creates this hook:
useGetPropertyOffersQuery

// 3. You use it in your component:
const { data, isLoading } = useGetPropertyOffersQuery({ page: 1, limit: 10 });
```

### Why This Is Confusing

1. **You never explicitly create the hook** - RTK Query does it automatically
2. **The exported name is different from what you defined** - `getPropertyOffers` becomes `useGetPropertyOffersQuery`
3. **The transformation follows a pattern you need to memorize**

## How RTK Query Works

### 1. Tags and Cache Invalidation

```javascript
// Tags are like labels for your cached data
providesTags: ['property_offers']  // This query provides this tag

// When you mutate data, you invalidate related tags
invalidatesTags: ['property_offers']  // This mutation invalidates the tag
```

**What happens:**
- When `getPropertyOffers` runs, RTK Query caches the result with tag `property_offers`
- When `declineOffer` runs successfully, it invalidates the `property_offers` tag
- RTK Query automatically refetches all queries that have that tag
- Your UI updates automatically with fresh data!

### 2. Using Queries in Components

```javascript
function MyComponent() {
	// Query hook returns an object with data, loading state, error, etc.
	const {
		data,           // The response data
		isLoading,      // True while loading
		isError,        // True if error occurred
		error,          // Error object if any
		refetch         // Function to manually refetch
	} = useGetPropertyOffersQuery({ page: 1 });

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;

	return <div>{data?.offers?.length} offers found</div>;
}
```

### 3. Using Mutations in Components

```javascript
function MyComponent() {
	// Mutation hook returns [trigger function, result object]
	const [acceptOffer, { isLoading, isSuccess }] = useAcceptOfferMutation();

	const handleAccept = async () => {
		try {
			const result = await acceptOffer(offerId).unwrap();
			console.log('Success:', result);
		} catch (error) {
			console.error('Failed:', error);
		}
	};

	return (
		<button onClick={handleAccept} disabled={isLoading}>
			{isLoading ? 'Accepting...' : 'Accept Offer'}
		</button>
	);
}
```

## RTK Query vs React Query

### RTK Query Pros:
- ✅ Automatic cache management
- ✅ Built into Redux (if you're already using it)
- ✅ Automatic hook generation
- ✅ Sophisticated tag-based invalidation

### RTK Query Cons:
- ❌ Steep learning curve
- ❌ Confusing naming conventions
- ❌ Requires Redux setup
- ❌ More boilerplate for simple use cases

### React Query Pros:
- ✅ Simple, intuitive API
- ✅ No Redux required
- ✅ Explicit naming (what you write is what you use)
- ✅ Great documentation and community

### React Query Cons:
- ❌ Manual cache key management
- ❌ Need to set up query client
- ❌ Less automatic than RTK Query

## Comparison Example

### RTK Query Approach:
```javascript
// API Definition (ProfileApi.js)
const ProfileApi = api.injectEndpoints({
	endpoints: (build) => ({
		getOffers: build.query({
			query: () => '/offers',
			providesTags: ['offers']
		}),
		acceptOffer: build.mutation({
			query: (id) => ({ url: `/offers/${id}/accept`, method: 'PUT' }),
			invalidatesTags: ['offers']
		})
	})
});

export const { useGetOffersQuery, useAcceptOfferMutation } = ProfileApi;

// Component usage
const { data } = useGetOffersQuery();
const [accept] = useAcceptOfferMutation();
```

### React Query Approach:
```javascript
// API Routes (propertyProfileApiRoutes.js)
export const getOffers = () => AuthApi().get('/offers');
export const acceptOffer = (id) => AuthApi().put(`/offers/${id}/accept`);

// Hook file (usePropertyOffers.js)
export function usePropertyOffers() {
	return useQuery(['offers'], getOffers);
}

export function useAcceptOfferMutation() {
	const queryClient = useQueryClient();
	return useMutation(acceptOffer, {
		onSuccess: () => {
			queryClient.invalidateQueries('offers');
		}
	});
}

// Component usage
const { data } = usePropertyOffers();
const { mutate: accept } = useAcceptOfferMutation();
```

## Why We Chose React Query for This Project

1. **Clearer naming** - `usePropertyOffers` is exactly what you write and use
2. **Less magic** - You see exactly how hooks are created
3. **Easier to understand** - The flow is explicit: API route → Hook → Component
4. **No Redux dependency** - Simpler stack
5. **Better for learning** - The pattern is more intuitive for new developers

## Key Takeaways

1. **RTK Query auto-generates hooks** - You define `getSomething` and get `useGetSomethingQuery`
2. **Pattern to remember**: `use` + `[Name]` + `Query/Mutation`
3. **Tags are powerful** - Automatic cache invalidation and refetching
4. **React Query is more explicit** - What you write is what you use
5. **Both are excellent tools** - Choose based on your project needs and team familiarity

## Further Reading

- [RTK Query Official Docs](https://redux-toolkit.js.org/rtk-query/overview)
- [React Query Official Docs](https://tanstack.com/query/latest/docs/react/overview)
- [When to use RTK Query vs React Query](https://blog.logrocket.com/rtk-query-vs-react-query/)

---

**Note**: The RTK Query implementation in `ProfileApi.js` has been preserved for learning purposes, but all components now use React Query for actual data fetching.
