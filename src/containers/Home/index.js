import React, { useState, useEffect } from "react";
import "./style.scss";
import TypeList from "./TypeList";
import HotList from "./HotList";
import TopTraders from "./TopTraders";
import ProductList from "./ProductList";
import CollectionList from "./CollectionList";
import API from "../../utils/api.js";

import { TYPES, PRODUCTS } from "../../config/AppDummyData";
import Axios from "axios";

const Home = () => {
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
      let apiUrl = typeOfListing === "saleItem" ? `${process.env.REACT_APP_API}/sale-item` : typeOfListing === "auction" ? `${process.env.REACT_APP_API}/auction` : "" ;
      apiUrl += `?page=${reset ? 0 : productsPage.page}`;
      if (option === "Newest First") apiUrl += `&filter=${-1}`;
      if (option === "Oldest First") apiUrl += `&filter=${1}`;
      if (option === "Highest First") apiUrl += `&filter=${-1}`;
      if (option === "Lowest First") apiUrl += `&filter=${1}`;
      if (type === "Created") apiUrl += `&searchField=createdAt`;
      if (type === "Price") apiUrl += `&searchField=pricePerItem`;

      const { data: response } = await Axios.get(apiUrl);
      isItemLoading = false;
      if (response && response.items) {
        if(typeOfListing === "auction") {
          products = response.items.filter((item) => item.endTime * 1000  > Date.now());
        } else {
          products = response.items;
        }
        setTotalItems(response.totalCount);
      } else {
        console.log(response);
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

    try {
      let allCollections = await Axios.post(`${process.env.REACT_APP_API}/get-collections`);

      console.log(allCollections.data);
      setCollectionsPage({
        page: 0,
        loadMoreVisible: true,
        list: allCollections.data,
        isItemLoading: false,
      })
    } catch (err) {
      console.log("Error on collections fetching");
      console.log(err);
    }
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
      <CollectionList
        data={collectionsPage}
        onLoadMore={handleLoadProducts}
        type={type}
        option={option}
        setType={setType}
        setOption={setOption}
        setTypeOfListing={setTypeOfListing}
        typeOfListing={typeOfListing}
      />
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

export default Home;
