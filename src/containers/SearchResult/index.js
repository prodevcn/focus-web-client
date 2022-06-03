import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import './style.scss';
import { PRODUCTS, CREATORS } from '../../config/AppDummyData';
import ProductCard from '../../components/Cards/ProductCard';
import UserCard from '../../components/Cards/UserCard';
import Axios from "axios";
import Loading from "components/Common/Loading";

const SearchResult = (props) => {
  const { searchWord } = props;
  const [tab, setTab] = useState('collectible');
  const [products, setProducts] = useState()
  const [creators, setCreators] = useState()
  const [loading, setLoading] = useState(false);

  console.log({ products })

  const fetchProductsData = () => {
    Axios.get(
      `${process.env.REACT_APP_API}/sale-item?keyword=${searchWord}`
    )
      .then((res) => {
        setProducts(res.data.items)
      })
      .catch((err) => console.log(err));
  }

  const changeLoading = (status) => {
    setLoading(status)
  }

  const fetchCreatorsData = () => {
    Axios.get(
      `${process.env.REACT_APP_API}/account?keyword=${searchWord}`
    )
      .then((res) => {
        console.log({ res })
        setCreators(res.data.users)
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    fetchProductsData()
    fetchCreatorsData()

  }, [searchWord]);

  return (
    <div>
      {
        loading ? <Loading /> :
          <div className="container search-result-page">
            <h1 className="page-title">
              Search Results for "{searchWord}"
            </h1>

            <div className="search-tabs">
              <span
                className={'search-tab ' + (tab === 'collectible' ? 'selected' : '')}
                onClick={() => setTab('collectible')}
              >
                Photo Assets
              </span>
              <span
                className={'search-tab ' + (tab === 'creator' ? 'selected' : '')}
                onClick={() => setTab('creator')}
              >
                Creators
              </span>
            </div>

            {
              tab === 'collectible' ?
                (
                  <div className="collectible-search-result">
                    {products != undefined ?
                      products.map((item, index) => {
                        let avatar = item.ownerAvatar;
                        if (item.minter == item.owner) {
                          avatar = item.minterAvatar
                        }
                        return <ProductCard
                          key={index}
                          id={item.tokenID}
                          title={item.name}
                          img={item.imageURL}
                          description={item.description}
                          descriptionImg={item.descriptionImg}
                          rating={item.pricePerItem / 1e18}
                          traderImg={avatar}
                          startingBid={item.startingBid}
                          quantity={item.quantity}
                          creator={item.minter}
                          changeLoading={changeLoading}
                        />
                      }) : <></>
                    }
                  </div>
                )
                :
                (
                  <div className="creator-search-result">
                    {creators &&
                      creators.map((item, index) => {
                        return <UserCard
                          key={index}
                          name={item.name}
                          code={item.code}
                          logo={item.avatar}
                          contents={item.contents}
                        />
                      })
                    }
                  </div>
                )
            }
          </div>
      }
    </div>
  );
};

const mapStateToProps = (state) => ({
  searchWord: state.search.searchWord
})

export default connect(mapStateToProps)(SearchResult);
