import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom'
import "./style.scss";
import TypeList from "./TypeList";
import HotList from "./HotList";
import TopTraders from "./TopTraders";
import ProductList from "./ProductList";
import API from "../../utils/api.js";

import { TYPES, PRODUCTS } from "../../config/AppDummyData";
import Axios from "axios";

const CollectionItems = () => {
  const location = useLocation();

  // const hotProducts = PRODUCTS.filter((item) => item.type === 'hotProduct');
  // const products = PRODUCTS.filter((item) => item.type === 'product');
  const [productsPage, setProductsPage] = useState({
    page: 0,
    loadMoreVisible: true,
    list: [],
    isItemLoading: false,
  });
  const [collectionsPage, setCollectionsPage] = useState({
    page: 0,
    loadMoreVisible: true,
    list: [],
    isItemLoading: false,
  });
  const [type, setType] = useState("Created");
  const [typeOfListing, setTypeOfListing] = useState("saleItem"); // saleItem | auction
  const [option, setOption] = useState("Newest First");

  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(100);
  const perPage = 15;

  useEffect(() => {
    fetchData();
  }, [currentItemIndex]);

  useEffect(() => {
    fetchData(true);
  }, [typeOfListing]);

  useEffect(() => {
    if (type && option) {
      setCurrentItemIndex(0);
      fetchData(true);
    }
  }, [type, option]);

  const fetchData = async (reset = false) => {
    let isItemLoading = false;
    let products = [];
    let collections = [];
    try {
      isItemLoading = true;

      const { data: response } = await Axios.post(`${process.env.REACT_APP_API}/collection-items`, {
        creator: location.pathname.split('/')[2],
        id: location.pathname.split('/')[3]
      });
      isItemLoading = false;

      if (response.fixedPrice) {
        products.push(...response.fixedPrice);

        setTotalItems(totalItems + response.fixedPrice.length);
      }
      if (response.auctions == []) {
        products.push(response.auctions);

        setTotalItems(totalItems + response.auctions.length);
      }

      for (let i = 0; i <= products.length; i++){
        let elem = products[i]
        let itemDetails = await Axios.get(`${process.env.REACT_APP_API}/collectible?tokenID=${elem.tokenID}`)
        
        products[i].imageURL = itemDetails.data.item.imageURL
        products[i].name = itemDetails.data.item.name
        products[i].liked = itemDetails.data.item.liked
        products[i].viewed= itemDetails.data.item.viewed
        products[i].imageURL = itemDetails.data.item.imageURL
      }

    } catch (err) {
      console.log(err);
      isItemLoading = false;
    }

    const page = reset ? 1 : productsPage.page + 1;
    const loadMoreVisible = page * perPage < totalItems;
    setProductsPage({
      page,
      loadMoreVisible,
      list: reset ? [...products] : [...productsPage.list, ...products],
      isItemLoading,
    });
  };
  const handleLoadProducts = async () => {
    setCurrentItemIndex(currentItemIndex + 1);
  };

  // const [products, setProducts] = useState([]);
  // const [pageNo, setPageNo] = useState(0);
  // const hotProducts = PRODUCTS.filter((item) => item.type === "hotProduct");
  // // const products = PRODUCTS.filter((item) => item.type === "product");

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //   const { data } = await Axios.get(
  //     `${process.env.REACT_APP_API}/sale-item?page=${pageNo}`
  //   );
  //   if (data) {
  //     setProducts(data.items);
  //   }
  // };

  return (
    <div className="home-page container">
      {/* <TypeList data={TYPES} />
      <HotList data={hotProducts} /> */}
      <TopTraders />

      <div className="focus-wrapper">
        <h4 className="beta-title">
          <span className="mark">BETA</span>
          <span className="email-body">Report issues by email:  &nbsp;<a className="email" href="mailto:tech@focus.market">tech@focus.market</a> </span> 
        </h4>
      </div>
      <ProductList
        data={productsPage}
        onLoadMore={handleLoadProducts}
        type={type}
        option={option}
        setType={setType}
        setOption={setOption}
        setTypeOfListing={setTypeOfListing}
        typeOfListing={typeOfListing}
      />
    </div>
  );
};

export default CollectionItems;
