const styles = {
    row: {
      display: "flex",
      flex: 1,
      flexDirection: "row",
    },
    column: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center"
    },
    leftColumn: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      textAlign: "left",
      justifyContent: "left",
      alignItems: "left"
    },
    textBox: {
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      fontFamily: `"Roboto Slab", "Times New Roman", serif`,
      fontWeight: "700",
      color: "white",
    },
    cropperContainer: {
      width: 50,
      height: 50,
    },
    container: {
      padding: "15px",
      marginRight: "auto",
      marginLeft: "auto",
      width: "100%",
      backgroundColor: "#91AbC0",
      fontFamily: `"Roboto Slab", "Times New Roman", serif`,
      justifyContent: "center",
      "@media (min-width: 576px)": {
        maxWidth: "540px",
      },
      "@media (min-width: 768px)": {
        maxWidth: "720px",
      },
      "@media (min-width: 992px)": {
        maxWidth: "960px",
      },
      "@media (min-width: 1200px)": {
        maxWidth: "1140px",
      },
    },
    boxShadow: {
      boxShadow:
        "0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
    },
  
    title: {
      color: "#3C4858",
      margin: "1.75rem 0 0.875rem",
      textDecoration: "none",
      fontWeight: "700",
      fontFamily: `"Roboto Slab", "Times New Roman", serif`,
      marginTop: "0",
      minHeight: "32px",
    },
  
    main: {
      background: "#216b80",
      position: "relative",
      zIndex: "3",
      fontFamily: `"Roboto Slab", "Times New Roman", serif`,
    },
  
    mainRaised: {
      margin: "0px 30px 0px",
      borderRadius: "6px",
      boxShadow:
        "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
    },  
    images: {
      display: "flex",
      flex: 1,
      width: "70%",
      alignSelf: "center",
    },
    gridImage: {
      display: "flex",
      flex: 1,
      width: "33%",
      alignSelf: "center"
    },
    colImage: {
      display: "flex",
      flex: 1,
      width: "80%",
      alignSelf: "center"
    },  
    cropButton: {
      display: "flex",
      flex: 1,
      width: "25%",
      alignSelf: "center",
    },
    analyzeButton: {
      display: "flex",
      flex: 1,
      height: 80,
      width: 250,
      alignSelf: "center",
    },
    loginButton: {
      display: "flex",
      flex: 1,
      height: 80,
      width: 250,
      alignSelf: "center",
    },
    deleteButton: {
      display: "flex",
      flex: 1,
      height: 30,
      width: 20,
      alignSelf: "center",
      padding: 2,
      margin: 10,
      marginLeft: 30,
    },
    hsvButton: {
      display: "flex",
      flex: 1,
      alignSelf: "center",
    },
    logo: {
      width: "50%"
    }
  };
  
  export default styles;
  