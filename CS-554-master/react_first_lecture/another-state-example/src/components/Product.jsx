function Product({product, handleClick}) {
  const buttonClick = () => {
    alert(product.productName + ' has been clicked!');
    handleClick(product);
  };
  return (
    <div>
      <h1>{product.productName}</h1>
      <p>{product.productDesc}</p>
      <p>{product.price}</p>
      <img height='50%' width='50%' src={product.imgName} />
      <br />
      <button onClick={buttonClick}>Buy the {product.productName} Now!</button>
    </div>
  );
}

export default Product;
