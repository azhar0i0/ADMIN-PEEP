import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Itable as Props, complex } from "../../../interfaces/Itable";
import Card from "../../UI/card/Card";
import Badge from "../../UI/badge/Badge";
import Modal from "../../UI/modal/Modal";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import classes from "./CustomTable.module.scss";

const CustomTable: React.FC<Props> = (props) => {
  /* =======================
     Hooks (MUST be first)
     ======================= */
  const [showModal, setShowModal] = useState(false);
  const [dataShow, setDataShow] = useState<complex[]>([]);
  const [currPage, setCurrPage] = useState(0);
  const { t } = useTranslation();

  /* =======================
     Normalize bodyData
     (array OR object)
     ======================= */
  const normalizedBodyData: complex[] = Array.isArray(props.bodyData)
    ? props.bodyData
    : Object.values(props.bodyData || {});

  /* =======================
     Effects
     ======================= */
  useEffect(() => {
    if (!normalizedBodyData.length) {
      setDataShow([]);
      return;
    }

    setDataShow(
      props.limit
        ? normalizedBodyData.slice(0, Number(props.limit))
        : normalizedBodyData
    );

    setCurrPage(0);
  }, [props.bodyData, props.limit]);

  /* =======================
     Handlers
     ======================= */
  const showModalHandler = () => {
    setShowModal((prev) => !prev);
  };

  const selectPage = (page: number) => {
    const start = Number(props.limit) * page;
    const end = start + Number(props.limit);

    setDataShow(normalizedBodyData.slice(start, end));
    setCurrPage(page);
  };

  /* =======================
     Table body renderer
     ======================= */
  function tableBody(item: complex | null | undefined, index: number) {
    if (!item || typeof item !== "object") return null;

    if ("username" in item) {
      return (
        <tr key={index}>
          <td>{item.username}</td>
          <td>{item.order}</td>
          <td>{item.price}</td>
        </tr>
      );
    }

    if ("orderId" in item) {
      return (
        <tr key={index}>
          <td>{item.orderId}</td>
          <td>{item.customer}</td>
          <td>{item.totalPrice}</td>
          <td>{item.date}</td>
          <td>
            <Badge content={item.status} />
          </td>
        </tr>
      );
    }

    if ("email" in item) {
      return (
        <tr key={index}>
          <td>{item.ID}</td>
          <td className={classes.userName}>
            <img
              className={classes.avatar}
              src={item.avatar}
              alt="user avatar"
            />
            {item.userName}
          </td>
          <td className="ltr">{item.email}</td>
          <td className="ltr">{item.phoneNumber}</td>
          <td>{item.totalOrders}</td>
          <td>{item.totalSpend}</td>
          <td>{item.location}</td>
          <td className={classes.actions}>
            <Icon icon="charm:menu-kebab" />
            <div className={classes.actions__box}>
              <div
                className={classes.actions__delete}
                onClick={showModalHandler}
              >
                <Icon icon="fluent:delete-24-regular" width="24" />
              </div>
              <div className={classes.actions__edit}>
                <Link to={`/customers/${item.ID}`}>
                  <Icon icon="fluent:edit-16-regular" width="24" />
                </Link>
              </div>
            </div>
          </td>
        </tr>
      );
    }

    if ("category" in item) {
      return (
        <tr key={index}>
          <td>{item.ID}</td>
          <td className={classes.product_name}>
            <img
              className={classes.product_img}
              src={item.pic}
              alt="product"
            />
            {item.product}
          </td>
          <td>{item.inventory}</td>
          <td>{item.price}</td>
          <td>{item.category}</td>
          <td className={classes.actions}>
            <Icon icon="charm:menu-kebab" />
            <div className={classes.actions__box}>
              <div
                className={classes.actions__delete}
                onClick={showModalHandler}
              >
                <Icon icon="fluent:delete-24-regular" width="24" />
              </div>
              <div className={classes.actions__edit}>
                <Link to={`/products/${item.ID}`}>
                  <Icon icon="fluent:edit-16-regular" width="24" />
                </Link>
              </div>
            </div>
          </td>
        </tr>
      );
    }

    return null;
  }

  /* =======================
     Pagination logic
     ======================= */
  let pages = 1;
  let range: number[] = [];

  if (props.limit !== undefined) {
    const page = Math.floor(
      normalizedBodyData.length / Number(props.limit)
    );
    pages =
      normalizedBodyData.length % Number(props.limit) === 0
        ? page
        : page + 1;
    range = [...Array(pages).keys()];
  }

  /* =======================
     Render
     ======================= */
  return (
    <>
      {showModal && (
        <Modal
          title={t("deleteCustomer")}
          message={t("modalMessage")}
          onConfirm={showModalHandler}
        />
      )}

      <div className={classes.container}>
        <Card>
          <div className={classes.wrapper}>
            <div className={classes.table__wrapper}>
              <table
                className={props.limit ? classes.largeTable : classes.table}
              >
                {props.headData && (
                  <thead>
                    <tr>
                      {props.headData.map((item, index) => (
                        <th key={index}>{t(item)}</th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {dataShow.map((item, index) =>
                    tableBody(item, index)
                  )}
                </tbody>
              </table>
            </div>

            {pages > 1 && (
              <div className={classes.table__pagination}>
                {range.map((item, index) => (
                  <div
                    key={index}
                    className={`${classes.table__pagination_item} ${
                      currPage === index ? classes.active : ""
                    }`}
                    onClick={() => selectPage(index)}
                  >
                    {item + 1}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

export default CustomTable;
