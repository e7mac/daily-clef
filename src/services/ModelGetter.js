export default class ModelGetter {
	constructor(api, url) {
		this.url = url
		this.itemsPromise = null
		this.hasMore = true
		this.items = []
		this.api = api
	}

	loadItems() {
		if (this.url!==null) {
			if (this.itemsPromise === null) {
				this.itemsPromise = this.api.apiCall(this.url)
				.then((response) => {
					this.items = this.items.concat(response.results);
					this.hasMore = (response.next!==null)
					this.url = response.next
					this.itemsPromise = null
					return this.items
				})
				.catch(error => console.log("error: " + error));
			}
			return this.itemsPromise
		}
	}
}
