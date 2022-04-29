
const Modal = (props) => {
  const { id, label } = props
  return (
    <>
      {/* button to open modal */}
      <label for={id} class="btn modal-button">{label}</label>

      {/* put this part before the </body> tag */}
      <input type="checkbox" id={id} class="modal-toggle"/>
      <label for={id} class="modal cursor-pointer modal-bottom sm:modal-middle">
        <label class="modal-box relative" for="">
          {props.children}
        </label>
      </label>
    </>
  );
};

export default Modal;