/////////////////////////////////////////////////////////
// Create ajax query to delete course from cart
function addEvent() {
  document.getElementsByName("delete").forEach((item) => {
    item.addEventListener("click", (event) => {
      const id = event.target.dataset.id;
      // Ajax
      fetch(`/cart/delete/${id}`, {
        method: "delete",
      })
        .then((res) => res.json())
        .then((items) => {
          console.log(items)
          if (items.length) {
            // cart is NOT empty
            let html = items
              .map((item2) => {
                return `<tr>
                        <td>${item2.courseId.name}</td>
                        <td>${item2.count}</td>
                        <td><input type="button" data-id="${item2.courseId._id}" name="delete" class="btn" value="Delete"></td>
                        </tr>`;
                }).join("");
            document.querySelector("tbody").innerHTML = html;
            const priceOutput = `<tr><td colspan="3"><h5>Price: ${items.price} $</h5></td></tr>`;
            document.querySelector("tfoot").innerHTML = priceOutput;
            addEvent();
          } else {
            // cart is empty
            document.querySelector(".table-container").innerHTML = '<div>Empty cart</div>';
          }
        });
    });
  });
}
addEvent();