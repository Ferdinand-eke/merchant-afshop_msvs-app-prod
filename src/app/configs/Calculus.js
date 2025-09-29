export function calculateShopEarnings(priceInput, percentageConvertion) {
	//   console.log('priceInput', priceInput);
	//   console.log('shopPlan', percentageConvertion);
	const shopEarning = priceInput - percentageConvertion * priceInput;
	return shopEarning.toFixed(2);
}

export function calculateCompanyEarnings(priceInput, percentageConvertion) {
	//   console.log('priceInput', priceInput);
	//   console.log('shopPlan', percentageConvertion);
	const shopEarning = priceInput - percentageConvertion * priceInput;

	const companyEarning = priceInput - shopEarning;
	return companyEarning.toFixed(2);
}
