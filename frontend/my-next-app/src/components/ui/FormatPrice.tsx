interface FormatPriceProps {
    price: number;
  }
  
  const FormatPrice: React.FC<FormatPriceProps> = ({ price }) => {
    return <span>{price.toLocaleString("vi-VN")} VND</span>;
  };
  
  export default FormatPrice;
  