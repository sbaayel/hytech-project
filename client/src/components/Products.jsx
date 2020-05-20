import React, { Component } from 'react'
import './Products.css'
import Product from './Product'
import Search from './Search'
import { AZ, ZA, lowestFirst, highestFirst } from "./Sort"
import Layout from './shared/Layout'
import { getProducts } from '../services/product'
import SideBar from './SideBar'


class Products extends Component {
  constructor() {
    super()
    this.state = {
      products: [],
      filterValue: '',
      filteredProducts: null,
      selectValue: 'Featured'
    }
  }

  async componentDidMount() {
    const products = await getProducts()
    this.setState({ products })
  }

  handleSearchChange = event => {
    const filter = () => {
      const filteredProducts = this.state.products.filter(product => {
        return product.name.toLowerCase().includes(this.state.filterValue.toLowerCase())
      })
      this.setState({ filteredProducts })
    }
    this.setState({ filterValue: event.target.value }, filter)
  }

  handleSortChange = event => {
    this.setState({ selectValue: event.target.value });
    let input = event.target.value; // a-z
    const { products } = this.state;
    switch (input) {
      case "name-ascending":
        this.setState({
          products: AZ(products)
        });
        break;
      case "name-descending":
        this.setState({
          products: ZA(products)
        });
        break;
      case "price-ascending":
        this.setState({
          products: lowestFirst(products)
        });
        break;
      case "price-descending":
        this.setState({
          products: highestFirst(products)
        });
        break;
      default:
        break
    }
  }

  handleSubmit = event => event.preventDefault()

  render() {
    const products = this.state.filteredProducts ? this.state.filteredProducts : this.state.products
    const PRODUCTS = products.map((product, index) =>
      <Product _id={product._id} name={product.name} author={product.author} imgURL={product.imgURL} description={product.description} subTitle={product.sub_title} like={product.like} createdAt={product.createdAt} key={index} />
    )

    const SIDEBAR = products.map((product, index) =>
      <SideBar _id={product._id} name={product.name} author={product.author} imgURL={product.imgURL} description={product.description} subTitle={product.sub_title} createdAt={product.createdAt} key={index} />
    )

    return (

      <Layout user={this.props.user}>
        <div className="rows">
          <div className="side">
            <Search onSubmit={this.handleSubmit} value={this.state.filterValue} onChange={this.handleSearchChange} />
            <form className="sort-container" onSubmit={this.handleSubmit}>
              <label className="sortBy" htmlFor="sort">SORT BY:</label>

              <select className="sort" value={this.state.selectValue} onChange={this.handleSortChange}>
                <option className="option" value="name-ascending" >&nbsp; Alphabetically, A-Z &nbsp;</option>
                <option value="name-descending">&nbsp; Alphabetically, Z-A &nbsp;</option>
                <option value="price-ascending">&nbsp; Price, low to high &nbsp;</option>
                <option value="price-descending">&nbsp; Price, high to low &nbsp;</option>
              </select>
            </form>

            <h2 className="hot-blog">HOT BLOGS</h2>
            {SIDEBAR}

          </div>
          <div className="main">


            <div className="products">

              {PRODUCTS}
            </div>
          </div>

        </div>
      </Layout>


    )
  }
}

export default Products