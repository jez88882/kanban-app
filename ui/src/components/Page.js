import React, { useEffect } from 'react';

export default function Page(props) {
  // to be run once
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `${props.title} | Kanban App`;
  },[]);

  return(
    <div className="page">
      {props.children}
    </div>
  );
}