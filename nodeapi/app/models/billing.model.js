const sql = require("./db.js");

// constructor
const Billing = function(billing) {
  this.date = billing.date;
  this.chalan_no = billing.chalan_no;
  this.sku = billing.sku;
  this.quantitiy = billing.quantitiy;
};

 Billing.getAll = result => {
  let query = "SELECT * FROM tbl_billing";
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("rack_name: ", res);
    result(null, res);
  });
};

Billing.create = (newBilling, result) => {
  sql.query("INSERT INTO tbl_billing SET ?", newBilling, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created billing: ", { id: res.insertId, ...newBilling });
    result(null, { id: res.insertId, ...newBilling });
  });
};

Billing.findByBillAndSku = (body, result) => {
  sql.query(`SELECT * FROM tbl_billing WHERE chalan_no = '${body.chalan_no}' and sku = '${body.sku}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null,res[0]);
    }
	else{
	result(null,0);	
	}

    // not found billing with the id
    
  });
};
Billing.updateById = (id, billing, result) => {
  sql.query(
    "UPDATE tbl_billing SET quantitiy = ? WHERE id = ?",
    [billing.quantitiy, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found billing with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated billing: ", { id: id, ...billing });
      result(null, { id: id, ...billing });
    }
  );
};

Billing.getSkuCubicFit = (sku) => {
	if(sku=='A')
	{
		return 1;
	}
	else if(sku=='B')
	{
		return 2;
	}
	else if(sku=='C')
	{
		return 0.5;
	}
	else if(sku=='D')
	{
		return 0.8;
	}
	else if(sku=='E')
	{
		return 2.5;
	}
} 

module.exports = Billing;
