export type SpecialDish = {
  id: number;
  title: string;
  price: string;
  rating: string;
  reviews: string;
  image: string;
};

export type Restaurant = {
  id: number;
  name: string;
  type: string;
  time: string;
  tag: string;
  rating: string;
  image: string;
};

export type Promotion = {
  id: number;
  title: string;
  discount: string;
  code: string;
  expiresIn: string;
  image: string;
};

export const specials: SpecialDish[] = [
  {
    id: 1,
    title: 'Herbed Roast Chicken',
    price: '$24.00',
    rating: '4.9',
    reviews: '120+',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAQHMc7QyNnTingOqz8PQpPEVnbFDCDzByqOKgHKs4D_DHhL4k90vAol7THrl4Luam5pHLtXeDlWltMRdZMH-uhY1bZ4UX2INHeIqKIVf2XoOTRLj4mPWKV8OssZdV5_qwilw2mL2kasyF0XshjKhZ_sTiJVAokTS06_nmcOsutbO2r5OcB7Ml0giANGxQTGM9BP7bjaiOHLz78DT6K0f3Bs7GOb1E035hTm90h7FXaOuIySF1ZVqnnKkU5uPZ5bwstfDhEjZGH9Oo',
  },
  {
    id: 2,
    title: 'Truffle Linguine',
    price: '$18.50',
    rating: '4.8',
    reviews: '85+',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDEuqj-JUDGb1m15prFoowaQSRz14Trj56BwCcGWNneIBUy39HQvAbB-7FSmVm3fy2Cc6gd5a1xx7A1yozlUvP1TIWhfEPRCg1UwZUeJgq9TWEPnmTfXGnoEYQydbnLS3CP5pFyUqJfvmsPcGZLWi3k16AcduWdgP3NEHAHw7wQJwrrprNDiP2lxqzr3zwxknKKHuyL7yOWQX40Qjz5VjGiX2g3xUtNwc-Hu0u5h1gTHaARWLOLpr8eKlPChObPH9AF7u34PALIJCo',
  },
  {
    id: 3,
    title: 'Premium Omakase Set',
    price: '$35.00',
    rating: '4.9',
    reviews: '200+',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAp5aakhFGAbWE7PcUx2VMhCH2MHOUExkeuszuOwvU_mgmHm0XoZ43MsTbi0hknVDE08xe-j-lWVIC7gW5wo2QAPv24HYSHKXM0L782BS-iAp0OjFfuDDjw17pEoBTX-B3oNSN6o5CGd4kvkJpoe1eHsYZbHoLti0kU25XvB8lDOOof2m7_FRKiKEtte46RhUmtytm64kUQ1EekAUcbUEJaMd_FJy_e_QULLM48u-WSWapIVqQvO_6LM7PP67vxDIvC2ZpLtFw5ncU',
  },
];

export const featuredRestaurants: Restaurant[] = [
  {
    id: 1,
    name: 'The Golden Grill',
    type: 'Modern American',
    time: '20-30 min',
    tag: 'Free Delivery',
    rating: '4.7',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAFxUKU-rKM6OE2GvIyKtTxObfRr3E0hJMBMtUa-CDlnV-WaENThBcxoIEeif41ZqmfMhwyh7fqAxekb8Plp_cQxFAQ8Z-jOJ-BScio5gecum08uqbHH-POILli1L-58jkXwFch7xWz9ba-1kNtEmL_ZhFgxBJkJ6NVHvbvfqe21chOzjGEBHIwhSeL97VdCmYrxPGp3qOF-7BCvzXXgUcziGO4CeuhZ3H9FYk-eQj4xJPslDhXzoR_k_2FVb76gilwG1nol2Z7vGU',
  },
  {
    id: 2,
    name: 'Umami Kitchen',
    type: 'Japanese Fusion',
    time: '15-25 min',
    tag: 'Top Rated',
    rating: '4.9',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAlnLwf2D_Zd5svruTzgK0zXRGFw1i9Oq2rhEPqV3uWc7Yw2sIBGW_SoD0gVTZORY1YVu6OQsagR__JPUODmfZRoK55xUKKnlGPHA3L8TAzhFfN5eiqGCMVN5r5vucxd44KYj-YuTSfxQESN2a6QQb9pZvFkPe2YhQ0veOWSyxoxtnJ91xy-9JXGGywkfREDoeOdhdbw0AxSGakGNk58sZOh0egkpgce8lXAcM2uqyIf1NfdzD81FHzeQyqG193GqIueGXJLyew_d0',
  },
];

export const promotions: Promotion[] = [
  {
    id: 1,
    title: 'Welcome Back! 50% Off Your Order',
    discount: '50%',
    code: 'WELCOME50',
    expiresIn: 'Ends in 2 days',
    image:
      'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 2,
    title: 'Free Delivery on Orders Over $35',
    discount: 'Free',
    code: 'FREEDELIVERY',
    expiresIn: 'Ends in 5 days',
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561a1f?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 3,
    title: 'Double Points on All Drinks',
    discount: '2x',
    code: 'DOUBLEPOINTS',
    expiresIn: 'Ends today',
    image:
      'https://images.unsplash.com/photo-1572688684789-1c1dced6236e?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 4,
    title: 'Lunch Special: $5 Off Any Meal',
    discount: '$5',
    code: 'LUNCH5',
    expiresIn: 'Ends in 3 days',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
  },
];
