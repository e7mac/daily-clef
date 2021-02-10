export default class ModelGetter {
	constructor(api, url, searchParams = {}) {
		this.url = url
		this.itemsPromise = null
		this.hasMore = true
		this.items = []
		this.api = api
		this.searchParams = searchParams
	}

	loadItems() {
		if (this.url !== null) {
			if (this.itemsPromise === null) {
				this.itemsPromise = this.api.apiCall(this.url, {
					method: 'GET'
				}, this.searchParams)
					.then((response) => {
						this.items = this.items.concat(response.results);

						this.hasMore = (response.next !== null)
						this.url = response.next
						return this.items
					})
					.catch(error => console.log("error: " + error));
			}
		}
		return this.itemsPromise
	}

	loadMoreItems() {
		if (this.url !== null && this.hasMore) {
			this.itemsPromise = this.api.apiCall(this.url, {
				method: 'GET'
			}, this.searchParams)
				.then((response) => {
					this.items = this.items.concat(response.results);

					this.hasMore = (response.next !== null)
					this.url = response.next
					return this.items
				})
				.catch(error => console.log("error: " + error));
		}
		return this.itemsPromise
	}

}
