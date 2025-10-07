// function CoreConcept(props){

export default function CoreConcept({image, description, title}) {
  return (
    <li>
      <img src={image} alt="" />
      <h3>{title}</h3>
      <p>{description}</p>
    </li>
  );
}