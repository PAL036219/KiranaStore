import Swal from 'sweetalert2'
const Successalert = (title)=>{
   const alert= Swal.fire({
  title: "Product is live Now.",
  width: 600,
  padding: "3em",
  color: "#716add",
  background: "#fff url(/images/trees.png)",
  backdrop: `
    rgba(0,0,123,0.4)
    url("/images/nyan-cat.gif")
    left top
    no-repeat
  `
});
return alert
 }



export default Successalert