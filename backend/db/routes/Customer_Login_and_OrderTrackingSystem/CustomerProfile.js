const pool = require('../../databaseConnection/mysqlConnection');
const jwt = require('jsonwebtoken');
const secret = "your_jwt_secret_key";
const bcrypt = require('bcrypt');


// middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const getCustomerProfile = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
      c.*,
      cb.*,
      ai.*,
      ai.updatedAt AS ai_updatedAt,
      ai.status AS acm_status,
      inv.invoice_id,
      inv.invoice_date,
      inv.updatedAt AS inv_updatedAt,
      inv.due_date,
      inv.total_on_road_price,
      inv.total_charges,
      inv.grand_total AS invoice_grand_total,
      inv.payment_status,
      inv.customer_account_balance,
      opd.order_date,
      opd.tentative_date,
      opd.preferred_date,
      opd.request_date,
      opd.prebooking,
      opd.prebooking_date,
      opd.delivery_date,
      cs.vin,
      cs.chassisNumber,
      cs.engineNumber,
      cs.allotmentCarStatus as allotmentStatus,
      cs.updatedAt  AS stock_updatedAt,
      o.id AS accessory_request_id,
      o.totalAmount AS accessory_total_amount,
      o.createdAt AS accessory_createdAt,
      o.status AS accessory_status,
      o.accessorieReason,
      o.accessorieRecipes,
      o.updatedAt AS accessory_updatedAt,
      p.id AS product_id,
      p.orderId,
      p.category AS product_category,
      p.name AS product_name,
      p.price AS product_price,
      s.coatingType,
      s.preferredDate,
      s.preferredTime,
      s.additionalNotes,
      s.coating_amount,
      s.durability,
      s.createdAt AS coating_createdAt,
      s.updatedAt  AS coating_updatedAt,
      s.status AS coating_status,
      s.coatingReason,
      s.id AS coating_id,
      rt.id AS RTO_id,
      rt.form20,
      rt.form21,
      rt.form22,
      rt.form34,
      rt.invoice,
      rt.insurance AS RTO_insurance,
      rt.puc,
      rt.idProof,
      rt.roadTax,
      rt.tempReg,
      rt.createdAt AS rto_createdAt,
      rt.updatedAt AS rto_updatedAt,
      rt.rto_amount,
      rt.status AS RTO_status,
      rt.rtoReason,
      rt.rtoRecipes,
      adi.exchange,
      adi.finance,
      adi.accessories,
      adi.coating,
      adi.rto,
      adi.fast_tag,
      adi.insurance,
      adi.auto_card,
      adi.extended_warranty,
      cir.id AS fasttag_id,
      cir.rcDocument,
      cir.panDocument,
      cir.passportPhoto,
      cir.fasttag_amount,
      cir.fasttagRecipes,
      cir.aadhaarDocument,
      cir.status AS fasttag_status,
      cir.fasttagReason,
      cir.createdAt AS fasttag_created,
      cir.updatedAt AS fasttag_updated,
      ins.id AS insurance_id,
      ins.rcDocument,
      ins.salesInvoice,
      ins.identityProof,
      ins.addressProof,
      ins.form21,
      ins.form22,
      ins.tempReg,
      ins.puc,
      ins.status AS insurance_status,
      ins.insuranceReason,
      ins.loanDocuments,
      ins.insurance_amount,
      ins.createdAt AS insurance_created,
      ins.updatedAt AS insurance_updated,
      aut.id AS autocard_id,
      aut.confirm_Benefits,
      aut.autocard_amount,
      aut.status AS autocard_status,
      aut.autoCardReason,
      aut.createdAt AS autocard_created,
      aut.updatedAt AS autocard_updated,
      ex.id AS warranty_id,
      ex.request_extended_warranty,
      ex.extendedwarranty_amount,
      ex.status AS ex_status,
      ex.ex_Reason,
      ex.createdAt AS ex_created,
      ex.updatedAt AS ex_updated,
      pre.id AS pdi_id,
      pre.status AS pdi_status,
      pre.PreDeliveryInspectionReason,
      pre.createdAt AS pdi_created,
      pre.updatedAt AS pdi_updated,
      gsc.id AS sc_id,
      gsc.status AS sc_status,
      gsc.gatepassReason,
      gsc.createdAt AS sc_created,
      gsc.updatedAt AS sc_updated,
      mc.id AS mc_id,
      mc.status AS msc_status,
      mc.securityClearanceReason,
      mc.createdAt AS msc_created,
      mc.updatedAt AS msc_updated,
      l.id AS loan_id,
      l.loan_amount,
      l.interest_rate,
      l.loan_duration,
      l.status AS loan_status,
      l.financeReason,
      l.financeAmount,
      l.calculated_emi,
      l.createdAt AS loan_created,
      d.id AS document_id,
      d.employed_type,
      d.document_name,
      d.uploaded_file AS document_path,
      d.uploaded_at AS document_uploaded,
      cer.id AS exchange_id,
      cer.rcDocument AS exchange_rcDocument,
      cer.insurancePolicy AS exchange_insurancePolicy,
      cer.pucCertificate AS exchange_pucCertificate,
      cer.identityProof AS exchange_identityProof,
      cer.addressProof AS exchange_addressProof,
      cer.loanClearance AS exchange_loanClearance,
      cer.serviceHistory AS exchange_serviceHistory,
      cer.carOwnerFullName AS exchange_carOwnerFullName,
      cer.carMake AS exchange_carMake,
      cer.carModel AS exchange_carModel,
      cer.carColor AS exchange_carColor,
      cer.carRegistration AS exchange_carRegistration,
      cer.carYear AS exchange_carYear,
      cer.status AS exchange_status,
      cer.exchangeAmount AS exchange_exchangeAmount,
      cer.exchangeReason AS exchange_exchangeReason,
      cer.createdAt AS exchange_createdAt,
      cer.updatedAt AS exchange_updatedAt,
      -- Additional charges fields
      ac.charge_id,
      ac.coating AS charge_coating,
      ac.fast_tag AS charge_fast_tag,
      ac.rto AS charge_rto,
      ac.insurance AS charge_insurance,
      ac.extended_warranty AS charge_extended_warranty,
      ac.auto_card AS charge_auto_card,
      ac.total_charges AS charge_total_charges,
      -- On road price details fields
      op.price_detail_id,
      op.ex_showroom_price,
      op.accessories AS price_accessories,
      op.discount,
      op.subtotal,
      op.gst_rate,
      op.gst_amount,
      op.cess_rate,
      op.cess_amount,
      op.total_on_road_price AS price_total_on_road,
      -- Account management refund fields
      amr.id AS refund_id,
      amr.status AS refund_status,
      amr.refundReason,
      amr.refundAmount,
      amr.transactionType,
      amr.createdAt AS refund_createdAt,
      amr.updatedAt AS refund_updatedAt,
      -- Cashier fields
      cash.id AS cashier_id,
      cash.debitedAmount,
      cash.creditedAmount,
      cash.paymentDate,
      cash.transactionType AS cashier_transactionType,
      cash.paymentType
    FROM customers c
    LEFT JOIN carbooking cb ON c.customerId = cb.customerId
    LEFT JOIN account_management ai ON c.customerId = ai.customerId
    LEFT JOIN invoice_summary inv ON c.customerId = inv.customerId
    LEFT JOIN orders_prebooking_date opd ON c.customerId = opd.customerId
    LEFT JOIN carstocks cs ON c.customerId = cs.customerId
    LEFT JOIN additional_info adi ON c.customerId = adi.customerId
    
        LEFT JOIN orders_accessories_request o 
          ON c.customerId = o.customerId 
          AND (adi.accessories = 'Yes' OR adi.accessories = 'YES')  -- Handle both cases
        LEFT JOIN order_products p 
          ON o.id = p.orderId

    LEFT JOIN coating_requests s ON c.customerId = s.customerId 
        AND adi.coating = 'Yes'
    LEFT JOIN car_rto_requests rt ON c.customerId = rt.customerId 
        AND adi.rto = 'Yes'
    LEFT JOIN car_fasttag_requests cir ON c.customerId = cir.customerId 
        AND adi.fast_tag = 'Yes'
    LEFT JOIN car_insurance_requests ins ON c.customerId = ins.customerId 
        AND adi.insurance = 'Yes'
    LEFT JOIN car_autocard_requests aut ON c.customerId = aut.customerId 
        AND adi.auto_card = 'Yes'
    LEFT JOIN car_extended_warranty_requests ex ON c.customerId = ex.customerId 
        AND adi.extended_warranty = 'Yes'
    LEFT JOIN predeliveryinspection pre ON c.customerId = pre.customerId
    LEFT JOIN gate_pass gsc ON c.customerId = gsc.customerId
    LEFT JOIN management_security_clearance mc ON c.customerId = mc.customerId
    LEFT JOIN car_exchange_requests cer ON c.customerId = cer.customerId 
        AND adi.exchange = 'Yes'
    LEFT JOIN loans l ON c.customerId = l.customerId 
        AND adi.finance = 'Yes'
    LEFT JOIN customer_documents d ON l.id = d.loan_id
    -- New joins for additional tables
    LEFT JOIN additional_charges ac ON inv.invoice_id = ac.invoice_id
    LEFT JOIN on_road_price_details op ON inv.invoice_id = op.invoice_id
    LEFT JOIN account_management_refund amr ON c.customerId = amr.customerId
    LEFT JOIN cashier cash ON c.customerId = cash.customerId
    WHERE c.customerId = ?`,
      [req.user.customerId]
    );

    const customersMap = new Map();

    rows.forEach((row) => {
      if (!row.customerId) return;

      const customerId = row.customerId;

      if (!customersMap.has(customerId)) {
        customersMap.set(customerId, {
          customerId,
          firstName: row.firstName || "",
          middleName: row.middleName || "",
          lastName: row.lastName || "",
          mobileNumber1: row.mobileNumber1 || "",
          mobileNumber2: row.mobileNumber2 || "",
          email: row.email || "",
          status: row.status || "", // Verify if this is from customers table
          address: row.address || "",
          city: row.city || "",
          state: row.state || "",
          country: row.country || "",
          carBooking: {
            model: row.model || "",
            version: row.version || "",
            color: row.color || "",
            fuelType: row.fuelType || "",
            transmission: row.transmission || "",
            team_Leader: row.team_Leader || "",
            team_Member: row.team_Member || "",
            exShowroomPrice: row.exShowroomPrice || 0,
            bookingAmount: row.bookingAmount || 0,
            mileage: row.mileage || 0,
            engineCapacity: row.engineCapacity || 0,
            batteryCapacity: row.batteryCapacity || 0,
            cardiscount: row.cardiscount || 0,
            groundClearance: row.groundClearance || "",
            bookingType: row.bookingType || "",
          },
          additional_info: {
            accessories: row.accessories || "",
            coating: row.coating || "",
            rto: row.rto || "",
            fast_tag: row.fast_tag || "",
            insurance: row.insurance || "",
            auto_card: row.auto_card || "",
            extended_warranty: row.extended_warranty || "",
            exchange: row.exchange || "",
            finance: row.finance || "",
          },
          account_management: {
            updatedAt: row.ai_updatedAt,
            status: row.acm_status,
            accountManagementRefund: []
          },
          invoiceInfo: {
            invoice_id: row.invoice_id || "",
            invoice_date: row.invoice_date || null,
            inv_updatedAt: row.inv_updatedAt || null,
            due_date: row.due_date || null,
            total_on_road_price: row.total_on_road_price || 0,
            total_charges: row.total_charges || 0,
            grand_total: row.invoice_grand_total || 0,
            payment_status: row.payment_status || "",
            customer_account_balance: row.customer_account_balance || 0,
            OnRoadPriceDetails: [],
            AdditionalCharges: [],
            CashierTransactions: []
          },
          orderInfo: {
            order_date: row.order_date || '',
            tentative_date: row.tentative_date || null,
            preferred_date: row.preferred_date || null,
            request_date: row.request_date || null,
            prebooking: row.prebooking || "",
            prebooking_date: row.prebooking_date || null,
            delivery_date: row.delivery_date || null,
          },
          stockInfo:
            row.vin || row.chassisNumber || row.engineNumber
              ? {
                vin: row.vin || "",
                chassisNumber: row.chassisNumber || "",
                engineNumber: row.engineNumber || "",
                allotmentStatus: row.allotmentStatus || "Not Allocated",
                updatedAt: row.stock_updatedAt || "",
              }
              : undefined,
          grandTotal: row.grand_total || row.invoice_grand_total || 0,
          loans: [],
          carexchangerequests: [],
          accessoriesRequests: [],
          coatingRequests: [],
          RTORequests: [],
          fasttagRequests: [],
          insuranceRequests: [],
          autocardRequests: [],
          extendedWarrantyRequests: [],
          predeliveryinspection: [],
          gate_pass: [],
          management_security_clearance: [],
        });
      }

      const customer = customersMap.get(customerId);



      if (row.loan_id) {
        let loan = customer.loans.find(loan => loan.id === row.loan_id);
        if (!loan) {
          loan = {
            id: row.loan_id,
            loan_amount: row.loan_amount,
            interest_rate: row.interest_rate,
            loan_duration: row.loan_duration,
            status: row.status,
            financeReason: row.financeReason,
            financeAmount: row.financeAmount,
            calculated_emi: row.calculated_emi,
            created_at: row.loan_created,
            documents: []
          };
          customer.loans.push(loan);
        }

        // Process document data
        if (row.document_id) {
          const existingDoc = loan.documents.find(doc => doc.id === row.document_id);
          if (!existingDoc) {
            loan.documents.push({
              id: row.document_id,
              employed_type: row.employed_type,
              document_name: row.document_name,
              document_path: row.document_path,
              uploaded_at: row.document_uploaded
            });
          }
        }
      }

      if (row.exchange_id && !customer.carexchangerequests.some(ex => ex.id === row.exchange_id)) {
        customer.carexchangerequests.push({
          id: row.exchange_id,
          rcDocument: row.exchange_rcDocument,
          insurancePolicy: row.exchange_insurancePolicy,
          pucCertificate: row.exchange_pucCertificate,
          identityProof: row.exchange_identityProof,
          addressProof: row.exchange_addressProof,
          loanClearance: row.exchange_loanClearance,
          serviceHistory: row.exchange_serviceHistory,
          carOwnerFullName: row.exchange_carOwnerFullName,
          carMake: row.exchange_carMake,
          carModel: row.exchange_carModel,
          carColor: row.exchange_carColor,
          carRegistration: row.exchange_carRegistration,
          carYear: row.exchange_carYear,
          status: row.exchange_status,
          exchangeAmount: row.exchange_exchangeAmount,
          exchangeReason: row.exchange_exchangeReason,
          createdAt: row.exchange_createdAt,
          updatedAt: row.exchange_updatedAt
        });
      }

      if (row.accessory_request_id) {
        let request = customer.accessoriesRequests.find(r => r.id === row.accessory_request_id);

        if (!request) {
          request = {
            id: row.accessory_request_id,
            totalAmount: row.accessory_total_amount,
            createdAt: row.accessory_createdAt,
            status: row.accessory_status,
            accessorieReason: row.accessorieReason,
            accessorieRecipes: row.accessorieRecipes,
            updatedAt: row.accessory_updatedAt,
            products: []
          };
          customer.accessoriesRequests.push(request);
        }
        // Add product if exists
        if (row.product_id) {
          request.products.push({
            id: row.product_id,
            orderId: row.orderId,
            category: row.product_category,
            name: row.product_name,
            price: row.product_price
          });
        }
      }

      if (row.coating_id) {
        const existingCoating = customer.coatingRequests.find(
          c => c.id === row.coating_id
        );

        if (!existingCoating) {
          customer.coatingRequests.push({
            id: row.coating_id,
            coatingType: row.coatingType,
            preferredDate: row.preferredDate,
            preferredTime: row.preferredTime,
            additionalNotes: row.additionalNotes,
            coating_amount: row.coating_amount,
            durability: row.durability,
            createdAt: row.coating_createdAt,
            updatedAt: row.coating_updatedAt,
            status: row.coating_status,
            reason: row.coatingReason
          });
        }
      }

      if (row.RTO_id && !customer.RTORequests.some(RTO => RTO.id === row.RTO_id)) {
        customer.RTORequests.push({
          id: row.RTO_id,
          form20: row.form20,
          form21: row.form21,
          form22: row.form22,
          form34: row.form34,
          invoice: row.invoice,
          insurance: row.RTO_insurance,
          puc: row.puc,
          idProof: row.idProof,
          roadTax: row.roadTax,
          tempReg: row.tempReg,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          rto_amount: row.rto_amount,
          status: row.RTO_status,
          rtoReason: row.rtoReason
        });
      }

      if (row.fasttag_id && !customer.fasttagRequests.some(fasttag => fasttag.id === row.fasttag_id)) {
        customer.fasttagRequests.push({
          id: row.fasttag_id,
          rcDocument: row.rcDocument,
          panDocument: row.panDocument,
          passportPhoto: row.passportPhoto,
          fasttag_amount: row.fasttag_amount,
          fasttagRecipes: row.fasttagRecipes,
          aadhaarDocument: row.aadhaarDocument,
          status: row.fasttag_status,
          fasttagReason: row.fasttagReason,
          createdAt: row.fasttag_created,
          updatedAt: row.fasttag_updated
        });
      }

      if (row.insurance_id && !customer.insuranceRequests.some(insurance => insurance.id === row.insurance_id)) {
        customer.insuranceRequests.push({
          id: row.insurance_id,
          rcDocument: row.rcDocument,
          salesInvoice: row.salesInvoice,
          identityProof: row.identityProof,
          addressProof: row.addressProof,

          form21: row.form21,
          form22: row.form22,
          tempReg: row.tempReg,
          status: row.insurance_status,
          puc: row.puc,
          insuranceReason: row.insuranceReason,
          loanDocuments: row.loanDocuments,
          insurance_amount: row.insurance_amount,
          createdAt: row.insurance_created,
          updatedAt: row.insurance_updated
        });
      }

      if (row.autocard_id && !customer.autocardRequests.some(autocard => autocard.id === row.autocard_id)) {
        customer.autocardRequests.push({
          id: row.autocard_id,
          confirm_Benefits: row.confirm_Benefits,
          autocard_amount: row.autocard_amount,
          status: row.autocard_status,
          autoCardReason: row.autoCardReason,
          createdAt: row.autocard_created,
          updatedAt: row.autocard_updated
        });
      }

      if (row.warranty_id && !customer.extendedWarrantyRequests.some(warranty => warranty.id === row.warranty_id)) {
        customer.extendedWarrantyRequests.push({
          id: row.warranty_id,
          request_extended_warranty: row.request_extended_warranty,
          extendedwarranty_amount: row.extendedwarranty_amount,
          status: row.ex_status,
          ex_Reason: row.ex_Reason,
          createdAt: row.ex_created,
          updatedAt: row.ex_updated
        });
      }

      if (row.pdi_id && !customer.predeliveryinspection.some(predeliveryinspection => predeliveryinspection.id === row.pdi_id)) {
        customer.predeliveryinspection.push({
          id: row.pdi_id,
          status: row.pdi_status,
          PreDeliveryInspectionReason: row.PreDeliveryInspectionReason,
          createdAt: row.pdi_created,
          updatedAt: row.pdi_updated
        });
      }

      if (row.sc_id && !customer.gate_pass.some(gate_pass => gate_pass.id === row.sc_id)) {
        customer.gate_pass.push({
          id: row.sc_id,
          status: row.sc_status,
          gatepassReason: row.gatepassReason,
          createdAt: row.sc_created,
          updatedAt: row.sc_updated
        });
      }

      if (row.mc_id && !customer.management_security_clearance.some(management_security_clearance => management_security_clearance.id === row.mc_id)) {
        customer.management_security_clearance.push({
          id: row.mc_id,
          status: row.msc_status,
          securityClearanceReason: row.securityClearanceReason,
          createdAt: row.msc_created,
          updatedAt: row.msc_updated
        });
      }


      // Process On Road Price Details
      if (row.price_detail_id && !customer.invoiceInfo.OnRoadPriceDetails.some(
        item => item.price_detail_id === row.price_detail_id
      )) {
        customer.invoiceInfo.OnRoadPriceDetails.push({
          price_detail_id: row.price_detail_id,
          ex_showroom_price: row.ex_showroom_price,
          accessories: row.price_accessories,
          discount: row.discount,
          subtotal: row.subtotal,
          gst_rate: row.gst_rate,
          gst_amount: row.gst_amount,
          cess_rate: row.cess_rate,
          cess_amount: row.cess_amount,
          total_on_road_price: row.price_total_on_road
        });
      }

      // Process Additional Charges
      if (row.charge_id && !customer.invoiceInfo.AdditionalCharges.some(
        item => item.charge_id === row.charge_id
      )) {
        customer.invoiceInfo.AdditionalCharges.push({
          charge_id: row.charge_id,
          coating: row.charge_coating,
          fast_tag: row.charge_fast_tag,
          rto: row.charge_rto,
          insurance: row.charge_insurance,
          extended_warranty: row.charge_extended_warranty,
          auto_card: row.charge_auto_card,
          total_charges: row.charge_total_charges
        });
      }

      // Process Account Management Refund
      if (row.refund_id && !customer.account_management.accountManagementRefund.some(
        item => item.id === row.refund_id
      )) {
        customer.account_management.accountManagementRefund.push({
          id: row.refund_id,
          status: row.refund_status,
          refundReason: row.refundReason,
          refundAmount: row.refundAmount,
          transactionType: row.transactionType,
          createdAt: row.refund_createdAt,
          updatedAt: row.refund_updatedAt
        });
      }

      // Process Cashier Transactions
      if (row.cashier_id && !customer.invoiceInfo.CashierTransactions.some(
        item => item.id === row.cashier_id
      )) {
        customer.invoiceInfo.CashierTransactions.push({
          id: row.cashier_id,
          debitedAmount: row.debitedAmount,
          creditedAmount: row.creditedAmount,
          paymentDate: row.paymentDate,
          transactionType: row.cashier_transactionType,
          paymentType: row.paymentType
        });
      }


    });

    const formattedResults = Array.from(customersMap.values());

    if (formattedResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer data not found",
      });
    }

    const user = formattedResults[0];
    res.json({ success: true, user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}


const Customerlogin = async (req, res) => {
  const { customerId, password } = req.body;

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM customers WHERE customerId = ?",
      [customerId]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Customer not found" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, customerId: user.customerId }, secret, {
      expiresIn: "2h",
    });

    // Remove password from user object
    delete user.password;

    // Prepare user data for response (exclude password)
    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };

    res.json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}


module.exports = { getCustomerProfile, verifyToken, Customerlogin };