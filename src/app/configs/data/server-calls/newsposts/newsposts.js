import { getBlogPosts, getBlogPostsById } from '../../client/clientToApiRoutes';
// import axios from 'axios';
// import { getCompanyNews } from '../apiRoutes';
// import reqApi, { fristGuestSeqApi, guestSeqApi } from '../utils';

export const getNewsPosts = async () => {
	const res = await getBlogPosts();
	const postsData = res.data.data;
	return postsData;
};

// export const createDepartment = async (values) => {
//   console.log('ApiValues', values);
//   const res = await reqApi().post(`/departments`, values);
//   console.log('ApiCreatedData', res);
//   const postResult = res.data;

//   return postResult;
// };

export const getNewsPost = async (slug) => {
	const res = await getBlogPostsById(slug);

	const postsData = res.data;
	// console.log('Single_POST Data', postsData);
	return postsData;
};

// export const updateDepartment = async (values) => {
//   const res = await reqApi().put(`/departments/${values._id}`, values);

//   //console.log('UpdatedDept_DATA', res);

//   const payloadResult = res.data;

//   return payloadResult;
// };
