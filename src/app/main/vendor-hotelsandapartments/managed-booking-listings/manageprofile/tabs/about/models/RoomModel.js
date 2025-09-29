import _ from '@lodash';
/**
 * The product model.
 */
const ProductModel = (data) =>
	_.defaults(data || {}, {
		// id: _.uniqueId('product-'),
		title: '',
		// description: '',
		images: []
		// width: '',
		// length: '',
		// price: '',
	});
export default ProductModel;
