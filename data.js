import bcrypt from "bcryptjs";

export const data = {
  articles: [
    {
      img: "https://post.healthline.com/wp-content/uploads/2020/09/Male_Indoor_Plants_732x549-thumbnail-732x549.jpg",
      name: "How to Care for Snake Plant",
      description:
        "Snake plants, also known as “Mother-in-Law’s Tongue” andSansevieria, are one of the easiest houseplants to take care of.This succulent plant is very forgiving and perfect for beginners. Here’s how to care for a snake plant in your home!  Native to southern Africa, snake plants are well adapted to conditions similar to those in southern regions of the United States. Because of this, they may be grown outdoors for part of all of the year in USDA zones 8 and warmer. However, they spread by sending out underground runners and may become invasive, so treat snake plants like you would bamboo; plant it only in contained areas or pots. Too much water and freezing temperatures are two of the very few things that can really affect this plant in a significant way. Soggy soil will cause root rot and extended exposure to cold temperatures can damage the foliage.",
      rating: 3,
      reviews: 10,
    },
    {
      img: "https://post.healthline.com/wp-content/uploads/2020/09/Male_Indoor_Plants_732x549-thumbnail-732x549.jpg",
      name: "How to Care for Snake",
      description:
        "Snake plants, also known as “Mother-in-Law’s Tongue” andSansevieria, are one of the easiest houseplants to take care of.This succulent plant is very forgiving and perfect for beginners. Here’s how to care for a snake plant in your home!  Native to southern Africa, snake plants are well adapted to conditions similar to those in southern regions of the United States. Because of this, they may be grown outdoors for part of all of the year in USDA zones 8 and warmer. However, they spread by sending out underground runners and may become invasive, so treat snake plants like you would bamboo; plant it only in contained areas or pots. Too much water and freezing temperatures are two of the very few things that can really affect this plant in a significant way. Soggy soil will cause root rot and extended exposure to cold temperatures can damage the foliage.",
      rating: 3,
      reviews: 10,
    },
  ],
  users: [
    {
      name: "Admin",
      email: "admin@gmail.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: true,
    },
    {
      name: "user",
      email: "user@gmail.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: false,
    },
  ],
  products: [
    {
      img: "https://www.ikea.com/om/en/images/products/fejka-artificial-potted-plant-in-outdoor-monstera__0614197_pe686822_s5.jpg?f=s",
      productName: "Monstera",
      category: "Plant",
      price: "500",
      slug: "Monstera",
      countInStock: 0,
      discount: 0,
      rating: 3,
      reviews: 5,
    },
    {
      img: "https://m.media-amazon.com/images/I/61MNGrjDTNS._SX466_.jpg",
      productName: "Guuchu Jade",
      category: "Plant",
      price: "200",
      slug: "Guuchu_Jade",
      countInStock: 8,
      discount: 10,
      rating: 3.5,
      reviews: 5,
    },
    {
      img: "https://assets.eflorist.com/assets/products/PHR_/TPL12-1A.jpg",
      productName: "Teleflora's Luxe Leaves",
      category: "Plant",
      price: "100",
      slug: "Teleflora's_Luxe_Leaves",
      countInStock: 10,
      discount: 0,
      rating: 2.5,
      reviews: 5,
    },
    {
      img: "https://target.scene7.com/is/image/Target/GUEST_415f6a69-d464-4620-ac4a-e499ecae2731?wid=488&hei=488&fmt=pjpeg",
      productName: "Costa Farms  Snake Plant",
      category: "Plant",
      price: "1000",
      slug: "Costa_Farms_Snake_Plant",
      countInStock: 2,
      discount: 0,
      rating: 2.0,
      reviews: 5,
    },
    {
      img: "https://www.potsandplants.com.au/wp-content/uploads/2021/08/chamber-pot-white.png",
      productName: "White Chamber pot",
      category: "Pot",
      price: "800",
      slug: "White_Chamber_pot",
      countInStock: 5,
      discount: 0,
      rating: 4.0,
      reviews: 5,
    },
  ],
};
