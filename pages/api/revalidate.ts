export default async function handler(req: any, res: any) {
  let revalidated = false;
  try {
    await res.revalidate("/");
    revalidated = true;
  } catch (err) {
    console.log(err);
  }
  res.json({
    revalidated,
  });
}
