import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Box,
  Collapse,
  IconButton,
  Chip,
  Modal,
  Checkbox,
  FormControlLabel,
  TextareaAutosize,
  Divider,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Description as DescriptionIcon,
  VerifiedRounded as VerifiedRoundedIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

// Mobile Card Row Component
const MobileCardRow = ({ customer, handleDocumentsClick, handleReject }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f57c00";
      case "Approval":
        return "#4caf50";
      case "Rejected":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        border: `1px solid ${getStatusColor(
          customer.fasttagRequests[0]?.status
        )}`,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {customer.customerId}
          </Typography>
          <Chip
            label={customer.fasttagRequests[0]?.status || "N/A"}
            size="small"
            sx={{
              backgroundColor: getStatusColor(
                customer.fasttagRequests[0]?.status
              ),
              color: "white",
            }}
          />
        </Box>

        <Typography variant="body2" sx={{ mt: 1 }}>
          {`${customer.firstName} ${customer.middleName || ""} ${
            customer.lastName
          }`}
        </Typography>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button
            size="small"
            startIcon={<DescriptionIcon />}
            onClick={() =>
              handleDocumentsClick(customer, customer.fasttagRequests[0])
            }
          >
            Documents
          </Button>
          <IconButton size="small" onClick={toggleExpand}>
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
             {/* Customer Details Section */}
             <Typography variant="h6" gutterBottom>
                Customer Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Email:</strong> {customer.email || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Phone1:</strong> {customer.mobileNumber1 || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone2:</strong> {customer.mobileNumber2 || "N/A"}
                  </Typography>
                </Grid>
              </Grid>

              {/* Vehicle Details Section */}
              <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
                Vehicle Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Allotment Status:</strong>{" "}
                    {customer?.stockInfo?.allotmentStatus || "Not Allocated"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>VIN:</strong> {customer?.stockInfo?.vin || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Chassis Number:</strong>{" "}
                    {customer?.stockInfo?.chassisNumber || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Engine Number:</strong>{" "}
                    {customer?.stockInfo?.engineNumber || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Car Details:</strong>{" "}
                    {customer.carBooking?.model || "N/A"} |{" "}
                    {customer.carBooking?.version || "N/A"} |{" "}
                    {customer.carBooking?.color || "N/A"}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
                Fast-Tag Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Fast-Tag Amount:</strong>{" "}
                    {customer.fasttagRequests[0]?.fasttag_amount || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Request Date:</strong>{" "}
                    {customer.fasttagRequests[0]?.createdAt
                      ? new Date(
                          customer.fasttagRequests[0].createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </Grid>
              </Grid>

            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={() => handleReject(customer)}
              >
                Reject
              </Button>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

// Tablet Row Component
const TabletRow = ({ customer, handleDocumentsClick, handleReject }) => {
  const [open, setOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f57c00";
      case "Approval":
        return "#4caf50";
      case "Rejected":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{customer.customerId}</TableCell>
        <TableCell>{`${customer.firstName} ${customer.lastName}`}</TableCell>
        <TableCell>
          <Chip
            label={customer.fasttagRequests[0]?.status || "N/A"}
            size="small"
            sx={{
              backgroundColor: getStatusColor(
                customer.fasttagRequests[0]?.status
              ),
              color: "white",
            }}
          />
        </TableCell>
        <TableCell>
          <IconButton
            size="small"
            onClick={() =>
              handleDocumentsClick(customer, customer.fasttagRequests[0])
            }
          >
            <DescriptionIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
   {/* Customer Details Section */}
   <Typography variant="h6" gutterBottom>
                Customer Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Email:</strong> {customer.email || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Phone1:</strong> {customer.mobileNumber1 || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone2:</strong> {customer.mobileNumber2 || "N/A"}
                  </Typography>
                </Grid>
              </Grid>

              {/* Vehicle Details Section */}
              <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
                Vehicle Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Allotment Status:</strong>{" "}
                    {customer?.stockInfo?.allotmentStatus || "Not Allocated"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>VIN:</strong> {customer?.stockInfo?.vin || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Chassis Number:</strong>{" "}
                    {customer?.stockInfo?.chassisNumber || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Engine Number:</strong>{" "}
                    {customer?.stockInfo?.engineNumber || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Car Details:</strong>{" "}
                    {customer.carBooking?.model || "N/A"} |{" "}
                    {customer.carBooking?.version || "N/A"} |{" "}
                    {customer.carBooking?.color || "N/A"}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
                Fast-Tag Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Fast-Tag Amount:</strong>{" "}
                    {customer.fasttagRequests[0]?.fasttag_amount || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Request Date:</strong>{" "}
                    {customer.fasttagRequests[0]?.createdAt
                      ? new Date(
                          customer.fasttagRequests[0].createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => handleReject(customer)}
                >
                  Reject
                </Button>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// Desktop Row Component
const DesktopRow = ({ customer, handleDocumentsClick, handleReject }) => {
  const [open, setOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f57c00";
      case "Approval":
        return "#4caf50";
      case "Rejected":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{customer.customerId}</TableCell>
        <TableCell>{`${customer.firstName} ${customer.middleName || ""} ${
          customer.lastName
        }`}</TableCell>
        <TableCell>{customer.email}</TableCell>
        <TableCell>
          {customer.carBooking?.model || "N/A"} |{" "}
          {customer.carBooking?.version || "N/A"} |{" "}
          {customer.carBooking?.color || "N/A"}
        </TableCell>
        <TableCell>
          {customer.fasttagRequests[0]?.fasttag_amount || "N/A"}
        </TableCell>
        <TableCell>
          <Chip
            label={customer.fasttagRequests[0]?.status || "N/A"}
            size="small"
            sx={{
              backgroundColor: getStatusColor(
                customer.fasttagRequests[0]?.status
              ),
              color: "white",
            }}
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() =>
                handleDocumentsClick(customer, customer.fasttagRequests[0])
              }
            >
              <DescriptionIcon />
            </IconButton>

            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={() => handleReject(customer)}
            >
              Reject
            </Button>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {/* Customer Details Section */}
              <Typography variant="h6" gutterBottom>
                Customer Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Email:</strong> {customer.email || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Phone1:</strong> {customer.mobileNumber1 || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone2:</strong> {customer.mobileNumber2 || "N/A"}
                  </Typography>
                </Grid>
              </Grid>

              {/* Vehicle Details Section */}
              <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
                Vehicle Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Allotment Status:</strong>{" "}
                    {customer?.stockInfo?.allotmentStatus || "Not Allocated"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>VIN:</strong> {customer?.stockInfo?.vin || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Chassis Number:</strong>{" "}
                    {customer?.stockInfo?.chassisNumber || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Engine Number:</strong>{" "}
                    {customer?.stockInfo?.engineNumber || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Car Details:</strong>{" "}
                    {customer.carBooking?.model || "N/A"} |{" "}
                    {customer.carBooking?.version || "N/A"} |{" "}
                    {customer.carBooking?.color || "N/A"}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
                Fast-Tag Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Fast-Tag Amount:</strong>{" "}
                    {customer.fasttagRequests[0]?.fasttag_amount || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Request Date:</strong>{" "}
                    {customer.fasttagRequests[0]?.createdAt
                      ? new Date(
                          customer.fasttagRequests[0].createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// Document Modal Component
const DocumentsModal = ({
  open,
  handleClose,
  selectedCustomer,
  selectedInsurance,
}) => {
  // Extract document details from the file path
  const getDocumentDetails = (document_path) => {
    if (!document_path) return { customerId: null, fileName: null };

    const fullPath = document_path.replace(/\\/g, "/");
    const pathParts = fullPath.split("/");
    const customerId = pathParts[pathParts.length - 2];
    const fileName = pathParts[pathParts.length - 1];

    return { customerId, fileName };
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="documents-modal-title"
      aria-describedby="documents-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: "70%" },
          maxHeight: "90vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflow: "auto",
        }}
      >
        <Typography id="documents-modal-title" variant="h6" component="h2">
          Fast-Tag Documents
        </Typography>

        {selectedCustomer && selectedInsurance && (
          <>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>Customer ID:</strong> {selectedCustomer.customerId}
              </Typography>
              <Typography variant="body1">
                <strong>Full Name:</strong>{" "}
                {`${selectedCustomer.firstName} ${
                  selectedCustomer.middleName || ""
                } ${selectedCustomer.lastName}`}
              </Typography>
              <Typography variant="body1">
                <strong>Fast-Tag Amount:</strong>{" "}
                {selectedInsurance.fasttag_amount ||
                  selectedInsurance.insurance_amount ||
                  "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Created At:</strong>{" "}
                {selectedInsurance.createdAt
                  ? new Date(selectedInsurance.createdAt).toLocaleString()
                  : "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Updated At:</strong>{" "}
                {selectedInsurance.updatedAt
                  ? new Date(selectedInsurance.updatedAt).toLocaleString()
                  : "N/A"}
              </Typography>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Document Name</TableCell>
                    <TableCell>View Document</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { name: "RC Document", path: selectedInsurance.rcDocument },
                    {
                      name: "PAN Document",
                      path: selectedInsurance.panDocument,
                    },
                    {
                      name: "Passport Photo",
                      path: selectedInsurance.passportPhoto,
                    },
                    {
                      name: "Address Proof",
                      path: selectedInsurance.aadhaarDocument,
                    },
                  ].map((doc, index) => {
                    const { customerId, fileName } = getDocumentDetails(
                      doc.path
                    );
                    return (
                      <TableRow key={index}>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>
                          {fileName ? (
                            <a
                              href={`http://localhost:5000/uploads/${customerId}/${encodeURIComponent(
                                fileName
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "blue",
                                textDecoration: "underline",
                              }}
                            >
                              View Document
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 3,
                gap: 1,
              }}
            >
              <Button onClick={handleClose} variant="outlined">
                Close
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

// Rejection Modal Component
const RejectionModal = ({
  open,
  handleClose,
  selectedCustomer,
  selectedInsurance,
  handleReject,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [fasttagReason, setFasttagReason] = useState("");
  const [error, setError] = useState(null);

  const confirmReject = () => {
    if (!isConfirmed) {
      setError("Please confirm the rejection");
      return;
    }

    if (!fasttagReason) {
      setError("Please provide a reason for rejection");
      return;
    }

    handleReject(selectedCustomer, fasttagReason);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="rejection-modal-title"
      aria-describedby="rejection-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: "50%" },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          id="rejection-modal-title"
          variant="h6"
          component="h2"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <strong>Reject Fast-Tag for:</strong>{" "}
          {selectedCustomer?.customerId || "N/A"}{" "}
          {selectedCustomer?.customerId && (
            <VerifiedRoundedIcon
              sx={{
                color: "#092e6b",
                fontSize: "15px",
                ml: 1,
              }}
            />
          )}
        </Typography>

        {selectedCustomer && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              <strong>Full Name:</strong>{" "}
              {`${selectedCustomer.firstName} ${
                selectedCustomer.middleName || ""
              } ${selectedCustomer.lastName}`}
            </Typography>
            {selectedInsurance && (
              <Typography variant="body1">
                <strong>Fast-Tag Amount:</strong>{" "}
                {selectedInsurance.fasttag_amount ||
                  selectedInsurance.insurance_amount ||
                  "N/A"}
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          <TextareaAutosize
            minRows={3}
            placeholder="Reason for Fast-Tag rejection (required)"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
            value={fasttagReason}
            onChange={(e) => setFasttagReason(e.target.value)}
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
            }
            label="I confirm the Fast-Tag rejection"
            sx={{ mt: 2 }}
          />

          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 1 }}
        >
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={confirmReject}
            variant="contained"
            color="error"
            disabled={!isConfirmed || !fasttagReason}
          >
            Confirm Rejection
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// Main Component
const FastTagApproved = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  // Fetch customers with insurance data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/fastTagshow"
        );
        if (response.data && Array.isArray(response.data.data)) {
          setCustomers(response.data.data);
        } else {
          throw new Error("Invalid data format: Expected an array.");
        }
      } catch (err) {
        setError("Failed to load customer data.");
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Filter customers based on search query and status "Approval"
  const getFilteredCustomers = () => {
    return customers.filter(
      (customer) =>
        customer.fasttagRequests[0]?.status === "Approval" &&
        (customer.customerId
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          customer.firstName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          customer.lastName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          customer.email?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredCustomers = getFilteredCustomers();

  // Handle documents modal
  const handleDocumentsClick = (customer, insurance) => {
    setSelectedCustomer(customer);
    setSelectedInsurance(insurance);
    setDocumentsModalOpen(true);
  };

  // Handle rejection modal
  const handleRejectClick = (customer) => {
    setSelectedCustomer(customer);
    setSelectedInsurance(customer.fasttagRequests[0]);
    setRejectionModalOpen(true);
  };

  // Handle reject action
  const handleReject = async (customer, reason) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/fastrejection/update-status/${customer.customerId}`,
        {
          status: "Rejected",
          fasttagReason: reason,
        }
      );

      if (response.status === 200) {
        alert("Fast-Tag rejected successfully!");
        setRejectionModalOpen(false);
        // Refresh the data
        const newData = await axios.get(
          "http://localhost:5000/api/fastTagshow"
        );
        setCustomers(newData.data.data);
      }
    } catch (err) {
      setError(
        `Failed to reject Fast-Tag: ${err.response?.data?.error || err.message}`
      );
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <Typography variant="h5" sx={{ mb: 3, color: "#071947" }}>
        Fast-Tag Management Approval
      </Typography>

      <Grid
        container
        justifyContent={isMobile ? "center" : "flex-start"}
        sx={{ mb: 3 }}
      >
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by ID, name, or email..."
            size={isMobile ? "small" : "medium"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", color: "error.main", my: 4 }}>
          <Typography>{error}</Typography>
        </Box>
      ) : (
        <>
          {/* Mobile View - Card Layout */}
          {isMobile && (
            <Box>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <MobileCardRow
                    key={customer.customerId}
                    customer={customer}
                    handleDocumentsClick={handleDocumentsClick}
                    handleReject={handleRejectClick}
                  />
                ))
              ) : (
                <Typography sx={{ textAlign: "center", my: 4 }}>
                  No Approval records found.
                </Typography>
              )}
            </Box>
          )}

          {/* Tablet View - Simplified Table */}
          {isTablet && (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width="50px" />
                    <TableCell>Customer ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <TabletRow
                        key={customer.customerId}
                        customer={customer}
                        handleDocumentsClick={handleDocumentsClick}
                        handleReject={handleRejectClick}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                        No Approval records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Desktop View - Full Table */}
          {isDesktop && (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width="50px" />
                    <TableCell>Customer ID</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Car Details</TableCell>
                    <TableCell>Fast-Tag Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <DesktopRow
                        key={customer.customerId}
                        customer={customer}
                        handleDocumentsClick={handleDocumentsClick}
                        handleReject={handleRejectClick}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ textAlign: "center" }}>
                        No Approval records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Documents Modal */}
      <DocumentsModal
        open={documentsModalOpen}
        handleClose={() => setDocumentsModalOpen(false)}
        selectedCustomer={selectedCustomer}
        selectedInsurance={selectedInsurance}
      />

      {/* Rejection Modal */}
      <RejectionModal
        open={rejectionModalOpen}
        handleClose={() => setRejectionModalOpen(false)}
        selectedCustomer={selectedCustomer}
        selectedInsurance={selectedInsurance}
        handleReject={handleReject}
      />
    </div>
  );
};

export default FastTagApproved;
