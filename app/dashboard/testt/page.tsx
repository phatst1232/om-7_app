async function getData() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function Page() {
  const data = await getData();
  if (data instanceof Array) {
    return (
      <div>
        {data.map((user) => {
          return <p>{user.id}</p>;
        })}
      </div>
    );
  }
  return <div>No data</div>;
}
