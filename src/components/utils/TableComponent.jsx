import React from "react";
import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
const TableComponent = ({ t_heading, orders,error,deleteOrder }) => {
  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            {t_heading &&
              t_heading.map((heading, i) => <th key={i + 1}>{heading}</th>)}
              <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.map((order, i) => (
              <tr key={i + 1}>
                <td>{order.id}</td>
                <td>{order.orderDescription}</td>
                <td>{order.count}</td>
                <td>{order.createdAt}</td>
                <td>
                  <Link className="mx-2 btn btn-primary" to={`/edit/order/${order.id}`}>Edit</Link>
                  <Button className="mx-2" variant="danger" onClick={()=>deleteOrder(order.id)} >Delete</Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default TableComponent;
