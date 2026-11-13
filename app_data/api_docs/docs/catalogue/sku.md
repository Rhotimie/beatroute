# sku

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `/v1/sku/other-skus` | kotlin | `getMarketingAssetsList` | `MarketingAssetsRequest` | `ArrayList<Product>` |
| GET | `v1/sku/customer-price` | kotlin | `getCustomerSkuPrice` | `-` | `ArrayList<DataSKU>` |
| GET | `v1/sku/distributor-inventory` | kotlin | `getDistributorInventory` | `-` | `ArrayList<VanSKusData>` |
| GET | `v1/sku/featured` | kotlin | `getSkuFeature` | `-` | `SkuTypeData` |
| GET | `v1/sku/get-all-list` | retrofit | `getAllSKUList` | `-` | `ArrayList<Product>` |
| GET | `v1/sku/get-all-list` | kotlin | `getAllSKUList` | `-` | `ArrayList<Product>` |
| GET | `v1/sku/get-config` | kotlin | `getProductCategoryType` | `-` | `ArrayList<Golden_Points>` |
| POST | `v1/sku/get-external-price` | kotlin | `fetchskuexternalprice` | `SkuDetailsRequest` | `SkuExternalPriceResponse` |
| GET | `v1/sku/get-invoice` | kotlin | `getInvoice` | `-` | `ArrayList<InvoiceResponse>` |
| GET | `v1/sku/master` | kotlin | `getSkuMaster` | `-` | `ResponseBody` |
| GET | `v1/sku/price` | retrofit | `getUpdatedSKUList` | `-` | `ArrayList<Product>` |
| GET | `v1/sku/price` | kotlin | `getSKUList` | `-` | `ArrayList<Product>` |
| POST | `v1/sku/price` | retrofit | `getSKUListDistributor` | `SingleRequest` | `ArrayList<DataSKU>` |
| POST | `v1/sku/price` | retrofit | `getUpdatedSKUListDistributor` | `SingleRequest` | `ArrayList<DataSKU>` |
| GET | `v1/sku/retailer-sku` | retrofit | `getInfoBandForSKU` | `-` | `ArrayList<DataSKU>` |
| GET | `v1/sku/van-skus` | kotlin | `getVanSkusList` | `-` | `ArrayList<VanSKusData>` |
| GET | `v1/sku/view` | retrofit | `getSkuDetail` | `-` | `Product` |
