const { db, query } = require("../config/db");
const axios = require("axios");

const insertDataToDatabase = async () => {
  const response = await axios.get(
    "https://api.rajaongkir.com/starter/city?key=68a71dcc1baf3183a021fe6012b510af"
  );

  const results = response.data.rajaongkir.results;

  const insertQuery = "INSERT INTO cities VALUES ?";

  // Mengubah data menjadi format yang sesuai untuk query
  const formattedData = results.map((result) => [
    result.city_id,
    result.city_name,
  ]);

  //   console.log(formattedData);

  await query(insertQuery, [formattedData], (error, queryResults) => {
    if (error) {
      console.error("Gagal memasukkan data:", error);
    } else {
      console.log(
        "Data berhasil dimasukkan:",
        queryResults.affectedRows,
        "baris terpengaruh"
      );
    }

    // Tutup koneksi setelah selesai
    db.end();
  });
};

insertDataToDatabase();
