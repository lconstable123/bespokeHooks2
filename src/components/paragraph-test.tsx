export const ParagraphTest = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-amber-300">
      <div
        className="bg-white p-4 rounded-lg shadow-lg mx-auto"
        style={{
          columns: 3,
          columnGap: "2rem",
          maxWidth: "900px",
          minHeight: "80vh",
        }}
      >
        <h2
          style={{
            columnSpan: "all",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          Heading
        </h2>
        <p style={{ breakBefore: "column" }}>
          This paragraph uses <b>break-before: column</b>.<br />
          It will always start at the top of a new column.
        </p>
        <p style={{ breakInside: "avoid" }}>
          This paragraph uses <b>break-inside: avoid</b>.<br />
          The browser will try to keep this whole paragraph together in one
          column.
        </p>
        <p style={{ breakBefore: "column" }}>
          This paragraph uses <b>break-before: column</b>.<br />
          It will always start at the top of a new column.
        </p>
        <p style={{ breakInside: "avoid" }}>
          This paragraph uses <b>break-inside: avoid</b>.<br />
          The browser will try to keep this whole paragraph together in one
          column.
        </p>
        <p style={{ breakAfter: "column" }}>
          This paragraph uses <b>break-after: column</b>.<br />
          The next content will always start at the top of a new column after
          this paragraph.
        </p>
        <p>
          This is a normal paragraph with no break rules.
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget
          aliquam massa nisl quis neque. Morbi non urna vitae elit cursus
          dictum. Etiam euismod, urna eu tincidunt consectetur, nisi nisl
          aliquam nunc, eget aliquam massa nisl quis neque. Vestibulum ante
          ipsum primis in faucibus orci luctus et ultrices posuere cubilia
          curae; Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl
          aliquam nunc. Aliquam erat volutpat. Pellentesque euismod, urna eu
          tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl
          quis neque.
        </p>
      </div>
    </div>
  );
};
