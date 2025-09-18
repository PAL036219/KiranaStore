import React, { useState } from "react";
import { 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiHeart
} from "react-icons/fi";


const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with: ${email}`);
      setEmail("");
    }
  };

  return (
    <footer className="bg-gradient-to-b from-green-50 to-white mt-20 md:mt-40 lg:mt-60">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
        {/* Trust Badges Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: <FiTruck size={24} />, title: "Free Delivery", desc: "On orders above ₹199" },
            { icon: <FiShield size={24} />, title: "Secure Payment", desc: "100% secure payment" },
            { icon: <FiRefreshCw size={24} />, title: "Easy Returns", desc: "30 days return policy" },
            { icon: <FiHeart size={24} />, title: "24/7 Support", desc: "Dedicated support" }
          ].map((item, index) => (
            <div key={index} className="text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-green-600 mb-2 flex justify-center">{item.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h2 className="text-lg font-bold text-green-800 mb-4 flex items-center">
              <span className="w-2 h-6 bg-green-600 rounded-full mr-2"></span>
              FreshGroceries
            </h2>
            <p className="text-gray-600 mb-4 text-sm">
              Your trusted partner for fresh groceries delivered right to your doorstep. Quality you can taste, service you can trust.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <FiPhone className="mr-2 text-green-600" size={16} />
                <span>+91-9876543210</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiMail className="mr-2 text-green-600" size={16} />
                <span>support@freshgroceries.com</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiMapPin className="mr-2 text-green-600" size={16} />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-3">
                {["About Us", "Our Services", "Contact Us", "Blog", "FAQs"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-green-700 transition-colors duration-200 text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="space-y-3">
                {["Privacy Policy", "Terms of Service", "Return Policy", "Shipping Info", "Careers"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-green-700 transition-colors duration-200 text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-3">
                {["Fresh Vegetables", "Fruits", "Dairy & Eggs", "Meat & Fish", "Bakery"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-green-700 transition-colors duration-200 text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="space-y-3">
                {["Beverages", "Snacks", "Frozen Food", "Organic", "Kitchen"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-green-700 transition-colors duration-200 text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Subscribe to our newsletter for exclusive deals, recipes, and grocery tips!
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-200 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Payment Methods */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">We Accept</h3>
            <div className="flex flex-wrap gap-2">
              {["VISA", "MasterCard", "PayPal", "UPI", "NetBanking"].map((method) => (
                <div
                  key={method}
                  className="bg-white px-3 py-2 rounded-lg text-xs font-medium text-gray-700 border border-gray-200 shadow-sm"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="flex items-center space-x-4">
            <h3 className="text-sm font-semibold text-gray-800">Follow Us:</h3>
            <div className="flex space-x-3">
              {[
                { icon: <FiFacebook size={18} />, color: "hover:text-blue-600" },
                { icon: <FiInstagram size={18} />, color: "hover:text-pink-600" },
                { icon: <FiTwitter size={18} />, color: "hover:text-blue-400" },
                { icon: <FiYoutube size={18} />, color: "hover:text-red-600" }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`text-gray-400 ${social.color} transition-colors duration-200 p-2 bg-white rounded-full shadow-sm hover:shadow-md`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} FreshGroceries. Made with ❤️ for fresh food lovers.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            <FiClock className="inline mr-1" size={12} />
            Delivery hours: 7 AM - 11 PM, 365 days
          </p>
        </div>
      </div>

      {/* Mobile App Banner */}
      <div className="bg-green-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Get the App</h3>
          <p className="text-green-100 text-sm mb-4">
            Download our app for faster ordering and exclusive offers
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              App Store
            </button>
            <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              Play Store
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;