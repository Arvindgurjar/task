const { connection } = require("../connection/connection")
const createOrder = (req, res) => {
    const { order_name,
        placed_date,
        approved_date,
        status_id,
        party_id,
        currency_uom_id,
        product_store_id,
        sales_channel_enum_id,
        grand_total,
        completed_date,
    } = req.body

    // console.log(order_name)

    if (!order_name || !placed_date || !approved_date || !status_id || !party_id || !currency_uom_id || !product_store_id || !sales_channel_enum_id || !grand_total || !completed_date) {
        res.status(206).json({ success: false, message: "missing data" });
    }
    const query = 'INSERT INTO order_header (order_name,placed_date,approved_date,status_id,party_id,currency_uom_id,product_store_id,sales_channel_enum_id,grand_total,completed_date) VALUES (?,?,?,?,?,?,?,?,?,?)';
    const values = [order_name, placed_date, approved_date, status_id, party_id, currency_uom_id, product_store_id, sales_channel_enum_id, grand_total, completed_date]
    // console.log(values)
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // console.log('User inserted:', result);
        res.status(201).json({ success: true, message: 'order created successfully', user: result });
    });
}
const placeOrder = (req, res) => {
    const { order_id, order_items } = req.body
    for (var i = 0; i < order_items.length; i++) {
        order_items[i].order_id = order_id;
    }
    const query = 'INSERT INTO order_item (order_id,order_item_seq_id,product_id,item_description,quantity,unit_amount,item_type_enum_id) VALUES ?';
    const values = order_items.map((item) => [item.order_id, item.order_item_seq_id, item.product_id, item.item_description, item.quantity, item.unit_amount, item.item_type_enum_id]);
    // console.log(values)
    connection.query(query, [values], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // console.log('User inserted:', result);
        res.status(201).json({ success: true, message: 'order created successfully', orderID: order_id });
    });

}

const getAllOrder = (req, res) => {
    const query = `SELECT order_header.*,
    CONCAT('[', GROUP_CONCAT(
        JSON_OBJECT(
            'order_item_seq_id', order_item.order_item_seq_id,
            'product_id', order_item.product_id,
            'item_description', order_item.item_description,
            'quantity', order_item.quantity,
            'unit_amount', order_item.unit_amount,
            'item_type_enum_id', order_item.item_type_enum_id
        )
        SEPARATOR ','
    ), ']') AS order_items
FROM order_header
LEFT JOIN order_item ON order_header.order_id = order_item.order_id
GROUP BY order_header.order_id;
`;

    // console.log(values)
    connection.query(query, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // console.log('User inserted:', result);
        res.status(201).json({ success: true, orders: result });
    });
}

const getSingleOrder = (req, res) => {
    const id = req.params.id
    const query = `SELECT order_header.*,
    CONCAT('[', GROUP_CONCAT(
      JSON_OBJECT(
        'order_item_seq_id', order_item.order_item_seq_id,
        'product_id', order_item.product_id,
        'item_description', order_item.item_description,
        'quantity', order_item.quantity,
        'unit_amount', order_item.unit_amount,
        'item_type_enum_id', order_item.item_type_enum_id
      )
    ), ']') AS order_items
  FROM order_header
  LEFT JOIN order_item ON order_header.order_id = order_item.order_id
  WHERE order_header.order_id = ?
  GROUP BY order_header.order_id;
`;

    values = [id]
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // console.log('User inserted:', result);
        res.status(201).json({ success: true, orders: result });
    });

}

const updateOrder = (req, res) => {
    const { order_id, order_name } = req.body
    const query = `UPDATE order_header
    SET order_name = ?
    WHERE order_id = ?
`;

    values = [order_name, order_id]
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const query1 = "select * from order_header where order_id = ?"
        value1 = [order_id]
        connection.query(query1, value1, (err, result) => {
            res.status(200).json({ success: true, message: "updated successfully", order: result });
        })
        // console.log('User inserted:', result);

    });


}

const createUser = (req, res) => {
    const { party_id, first_name, middle_name, last_name, gender, birth_date, marital_status_enum_id, employment_status_enum_id, occupation } = req.body
    const query = `insert into person (party_id, first_name, middle_name, last_name, gender, birth_date, marital_status_enum_id, employment_status_enum_id, occupation) values (?,?,?,?,?,?,?,?,?)
        `;

    values = [party_id, first_name, middle_name, last_name, gender, birth_date, marital_status_enum_id, employment_status_enum_id, occupation]
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // console.log('User inserted:', result);
        res.status(201).json({ success: true, message: "person created successfully", orders: result });
    });

}
module.exports = { createOrder, placeOrder, getAllOrder, getSingleOrder, updateOrder, createUser }