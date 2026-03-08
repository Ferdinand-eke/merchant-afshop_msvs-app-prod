import _ from '@lodash';
/**
 * The product model.
 */
const ProductModel = (data) =>
	_.defaults(data || {}, {
		// id: _.uniqueId('product-'),
		title: '',
		// description: '',
		images: [],
		// width: '',
		// length: '',
		// price: '',
		// VAT fields
		vatEnabled: false,
		vatRate: 7.5,
		priceWithoutVAT: 0,
		priceWithVAT: 0,
		vatAmount: 0
	});
export default ProductModel;
