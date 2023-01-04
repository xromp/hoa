//import Vue from "vue";
import axios from "axios";
import fuze from "./modules/fuze_client.js";
const strBaseUrl = "https://caliberbackend.axesspoint.app/admin/";
const client = axios.create({
  baseURL: strBaseUrl,
  json: true
});

let arrStructures = [];

export default {
  async execute(method, resource, data) {
    console.log("calling resource" + resource);
    // inject the accessToken for each request
    //let accessToken = await Vue.prototype.$auth.getAccessToken();
    return client({
      method,
      url: resource,
      data
      /*headers: {
        Authorization: `Bearer ${accessToken}`,
      },*/
    }).then(req => {
      console.log(req);
      return req.data;
    });
  },
  async getUnitProfile(intUnitId) {
    const strBase = `/proxy/unit/${intUnitId}`;

    let arrUrls = [
      { name: "objUnit", url: "" },
      { name: "arrUnitAccounts", url: "unitaccounts/all" },
      { name: "objCurrentUnitAccount", url: "unitaccount/current" },
      {
        name: "arrCurrentUnitAccountContacts",
        url: "unitaccount/current/contacts"
      },
      { name: "arrCurrentOwners", url: "currentowners" },

      { name: "notes", url: "notes" },
      { name: "documents", url: "documents" },
      { name: "maintenance", url: "maintenance/all" },
      { name: "pictures", url: "pictures" },
      { name: "violations", url: "violations/all" }
    ];

    let arrPromises = [];
    for (let objUrl of arrUrls) {
      var objPromise = this.execute("get", `${strBase}/${objUrl.url}`).catch(
        error => {
          return error;
        }
      );
      arrPromises.push(objPromise);
    }

    let arrValues = await Promise.all(arrPromises);

    const getValue = strName => {
      var intIndex = arrUrls.findIndex(obj => obj.name == strName);
      return arrValues[intIndex];
    };
    let objUnit = getValue("objUnit");
    console.log("Unit", objUnit);

    let arrCurrentOwners = getValue("arrCurrentOwners");
    console.log("Current Owners", arrCurrentOwners);

    let arrUnitAccounts = getValue("arrUnitAccounts");

    return {
      objUnit,
      arrCurrentOwners,
      arrUnitAccounts:arrUnitAccounts
    };
  },getUnit(intUnitId){
      return this.execute("get", `/proxy/unit/${intUnitId}`)
  },
  getPosts() {
    return this.execute("get", "/posts");
  },
  getPost(id) {
    return this.execute("get", `/posts/${id}`);
  },
  createPost(data) {
    return this.execute("post", "/posts", data);
  },
  updatePost(id, data) {
    return this.execute("put", `/posts/${id}`, data);
  },
  deletePost(id) {
    return this.execute("delete", `/posts/${id}`);
  },
  async getUnits() {
    //var obj= await this.execute("get", `/units?mode=live`);
    var obj = await this.execute("get", `/units`);

    return obj;
  },
  async getUnitAccounts(intId) {
    var obj = await this.execute("get", `/units/${intId}/accounts`);
    return obj;
  },
  async getUnitAccountTransactions(intId) {
    var obj = await this.execute("get", `unit-accounts/${intId}/transactions`);
    return obj;
  },

  async getMaintenanceItems(strWhich = "all") {
    let intClientId = this.getClientId();
    let strRoute = `/proxy/client/${intClientId}/maintenance/${strWhich}`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getDelinquencyItems() {
    let intClientId = this.getClientId();
    let strRoute = `/proxy/client/${intClientId}/delinquencies`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getInvoices(intClientId) {
    let strRoute = `/proxy/client/${intClientId}/invoices`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getPendingPayments(intClientId) {
    let strRoute = `/proxy/pendingpayments/${intClientId}`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getCharges(intClientId, strSinceDate = "") {
    let strRoute = `/proxy/client/${intClientId}/charges/${strSinceDate}`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getPBKs(intClientId) {
    /*Use this method to retrieve a list of all passes, 
    badges and keys assigned to owners and occupants for the client 
    specified by the 'clientId' parameter, including previous 
    owners/contacts.
    */
    let strRoute = `/proxy/client/${intClientId}/pbk/all`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getTransactionAccounts(intClientId) {
    /** 
     * Use this method to retrieve the transaction accounts 
     * for the client specified by the 'clientId'. 
     * This is just a list of the transaction accounts by name and id. 
     * To retrieve an owner's transaction account (owner ledger) 
     * you must call the /api/v2/unitaccount/{unitAccountId}/transactions/{tAcctId:int?}/{fromDate:datetime?} 
     * method.

    */
    let strRoute = `proxy/client/${intClientId}/transactionaccounts`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getViolations(intClientId) {
    let strRoute = `proxy/client/${intClientId}/violations`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },

  /********************NEW */
  async getClients() {
    let strRoute = `proxy/clientlist`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientGroups(intClientId) {
    intClientId = this.getClientId();
    let strRoute = `proxy/client/${intClientId}/groups`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientUnits(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/units`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientOwners(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/owners`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientContacts(intClientId, strType = "all") {
    intClientId = this.getClientId();
    //strType = current or all
    let strRoute = `proxy/client/${intClientId}/contacts/${strType}`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientCommonAreas(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/commonareas`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientContactGroups(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/clientcontactgroups`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientVendors(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/vendors`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientNotes(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/notes`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientDocuments(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/documents`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientChartOfAccounts(id) {
    let intClientId = id;
    let strRoute = `proxy/client/${intClientId}/chartofaccounts`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientBillingRecords(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/billingrecords`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientInsurance(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/insurance`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientInvoices(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/invoices`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientViolationsKB(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/kb/violations`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientMaintenanceKB(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/kb/maintenance`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientCostCenters(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/costcenters`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientCCRs(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/ccrs`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientFactSheet(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/factsheet`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientResale(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/resale`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientHierarchyDocs(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/hierarchy/docs`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientHierarchyLinks(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/hierarchy/links`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientMaintenance(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/maintenance`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getWorkOrders() {
    let intClientId = this.getClientId();
    let strRoute = `proxy/client/${intClientId}/workorders/open`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientWorkOrders() {
    let intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/workorders/open`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientViolations(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/violations`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientTransactionAccounts(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/transactionaccounts`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientDelinquencies(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/delinquencies`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientArchitechturalItems(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/architecturalitems`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientOtherPayees(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/otherpayees`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientDirectoryContacts(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/directory/contact`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientPBKs(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/pbk/all`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientPendingPayments(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/pendingpayments/${intClientId}`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientCharges(intClientId, strSinceDate = "2019-05-01") {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/charges/${strSinceDate}`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClient1099Adj(intClientId, intTaxYear = 2019) {
    intClientId = this.getClientId();
    let strRoute = `proxy/client/${intClientId}/1099adj/${intTaxYear}`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientAppliedPayments(
    intClientId,
    strStartDate = "2019-01-01",
    strEndDate = "2019-11-01"
  ) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/appliedpayments/${strStartDate}/${strEndDate}`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientLatestAppliedPayments(
    intClientId,
    strStartDate = "2019-01-01",
    strEndTime = "2019-11-01"
  ) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/latestappliedpayments/${strStartDate}/${strEndDate}`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientPostingCodes(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/postingcodes/all`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getClientUnitResale(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/client/${intClientId}/unitresale/all`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  getClientId() {
    return 1;
  },
  /***
   *
   * FUZE
   */
  async payCC(objParams) {
    let objResponse = await fuze.payCC(objParams);
    return objResponse;
  },
  async payACH(objParams) {
    var objResponse = await fuze.payACH(objParams);
    return objResponse;
  },
  async getPaymentProviders(objParams) {
    let strRoute = `proxy/paymentproviders`;
    objParams = {
      ContactID: 1,
      NameOption: 1,
      AccountNumber: "100110010",
      TAcctID: 2,
      Balance: 10.0,
      RedirectUrl: "https://localhost/",
      CssUrl: ""
    };
    var obj = await this.execute("post", strRoute, objParams);
    console.log(obj);
    return objResponse;
  },
  async getUnitAccountsForUnit(intUnitId, strType = "all") {
    //strType can be current for current unitaccounts
    let strRoute = `proxy/unit/${intUnitId}/unitaccounts/${strType}`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getUnitAccountTransactionsNew(intUnitAccountId) {
    let strRoute = `proxy/unitaccount/${intUnitAccountId}/transactions`;

    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getContact(intContactId) {
    let strRoute = `proxy/contact/${intContactId}/`;

    let arr = this.execute("get", strRoute);
    return arr;
  },
  async getUnitAccount(intUnitAccountId) {
    let strRoute = `proxy/unitaccount/${intUnitAccountId}/`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getContactUnits(intContactId) {
    //get all the units of this contact
    let strRoute = `proxy/contact/${intContactId}/units`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getInvoiceDetails(intInvoiceId) {
    let strRoute = `proxy/invoice/${intInvoiceId}/details`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getDocumentsForInvoice(intInvoiceId) {
    let strRoute = `proxy/invoice/${intInvoiceId}/documents`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getDocument(intDocumentId) {
    let strRoute = `proxy/document/${intDocumentId}`;
    let obj = await this.execute("get", strRoute);
    return obj;
  },
  getDocumentUrl(intDocumentId) {
    let strUrl = `${strBaseUrl}/proxy/document/${intDocumentId}`;
    return strUrl;
  },
  async getClientEmployees(intClientId) {
    intClientId = this.getClientId();

    let strRoute = `proxy/mgmtco/employees`;
    let arr = await this.execute("get", strRoute);
    return arr;
  },
  async getBalanceSheetItems(id) {
    let arr = this.getClientChartOfAccounts(id);
    return arr;
  }
};
