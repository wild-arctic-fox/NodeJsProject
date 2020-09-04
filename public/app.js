/////////////////////////////////////////////////////////
// Create ajax query to delete course from cart
function addEvent() {
  document.getElementsByName("delete").forEach((item) => {
    item.addEventListener("click", (event) => {
      const id = event.target.dataset.id;
      const csrf = event.target.dataset.csrf;
      // Ajax
      fetch(`/cart/delete/${id}`, {
        method: "delete",
        headers: {'X-XSRF-TOKEN': csrf}
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.courses.length) {
            // cart is NOT empty
            let html = data.courses
              .map((item2) => {
                return `<tr>
                        <td>${item2.name}</td>
                        <td>${item2.count}</td>
                        <td><input type="button" data-id="${item2._id}" data-csrf="${csrf}" name="delete" class="btn" value="Delete"></td>
                        </tr>`;
                }).join("");
            document.querySelector("tbody").innerHTML = html;
            const priceOutput = `<tr><td colspan="3"><h5>Price: ${data.price} $</h5></td></tr>`;
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

var instance = M.Tabs.init(document.querySelectorAll('.tabs'));