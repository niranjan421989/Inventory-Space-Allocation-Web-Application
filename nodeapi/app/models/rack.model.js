const sql = require("./db.js");

// constructor
const Rack = function(rack) {
  this.rack_name = rack.rack_name;
  this.capcity = rack.capcity;
  this.orders = rack.orders;
  this.capcity_rank = rack.capcity_rank;
  this.s_r = rack.s_r;
};

 

Rack.findById = (id, result) => {
  sql.query(`SELECT * FROM rack WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found rack: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found rack with the id
    result({ kind: "not_found" }, null);
  });
};

Rack.getAll = result => {
  let query = "SELECT * FROM rack";
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

Rack.updateById = (id, rack, result) => {
	var s_r = parseFloat(rack.capcity_rank*0.3) + parseFloat(rack.orders*0.7);
  sql.query(
"UPDATE rack SET orders = ?, s_r = ? WHERE id = ?",
    [rack.orders, s_r, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Rack with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated rack: ", { id: id, ...rack });
      result(null, { id: id, ...rack });
    }
  );
};
function getRackForItem(item, sort_rack_sr) {
  for (let rack of sort_rack_sr) {
    if (item.allocate_space <= rack.capcity * 0.9) {
      console.log(`Rack for item ${item.sku} = ${rack.rack_name}`);
      return rack.rack_name;
    }
  }
  return false;
}
Rack.allocateSpace = (items, racks) => {
  let sort_rack_sr = racks.sort((r1, r2) => r1.s_r - r2.s_r);
  for (let item of items) {
    item.rack = getRackForItem(item, sort_rack_sr);
    if (item.rack) {
      sort_rack_sr = sort_rack_sr.filter((r) => r.rack_name != item.rack);
    }
  }
  return items;
}


module.exports = Rack;
