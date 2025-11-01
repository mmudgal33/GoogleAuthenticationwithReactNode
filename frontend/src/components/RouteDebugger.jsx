// Debug component
const RouteDebugger = () => {
    const location = useLocation();
    
    return (
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">Route Debug Information</Typography>
        <Typography variant="body2">
          Current Path: {location.pathname}
        </Typography>
        <Typography variant="body2">
          Full URL: {window.location.href}
        </Typography>
        <Typography variant="body2">
          Search Params: {location.search}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => window.history.back()}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Paper>
    );
  };

  export default RouteDebugger;