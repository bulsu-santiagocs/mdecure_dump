import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { supabase } from "@/supabase/client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Loader, CheckCircle, XCircle } from "lucide-react";

const toBase64 = (url) =>
  fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );

const generateProductPDF = async (products, brandingData) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const logoBase64 = await toBase64(brandingData.logo_url);

    const totalProducts = products.length;
    const totalQuantity = products.reduce(
      (sum, p) => sum + (p.quantity || 0),
      0
    );
    const totalValue = products.reduce(
      (sum, p) => sum + (p.quantity || 0) * (p.price || 0),
      0
    );
    const availableCount = products.filter(
      (p) => p.status === "Available"
    ).length;
    const unavailableCount = products.filter(
      (p) => p.status === "Unavailable"
    ).length;

    const tableColumn = [
      "ID",
      "Name",
      "Category",
      "Quantity",
      "Price",
      "Expiry",
      "Status",
    ];
    const tableRows = products.map((p) => [
      p.medicineId || "N/A",
      p.name || "N/A",
      p.category || "N/A",
      p.quantity,
      `PHP ${p.price ? p.price.toFixed(2) : "0.00"}`,
      p.expireDate || "N/A",
      p.status || "N/A",
    ]);

    const exportDateTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const drawHeaderAndSummary = () => {
      doc.addImage(logoBase64, "PNG", 14, 10, 20, 20);
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFont("helvetica", "bold");
      doc.text(brandingData.name, 38, 18);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text("Malolos, Central Luzon, Philippines", 38, 24);
      doc.text("Phone: (123) 456-7890 | Email: contact@medcure.ph", 38, 28);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40);
      doc.text("Product Inventory Report", pageWidth - 14, 20, {
        align: "right",
      });
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`Exported on: ${exportDateTime}`, pageWidth - 14, 25, {
        align: "right",
      });
      doc.setDrawColor(224, 224, 224);
      doc.line(14, 38, pageWidth - 14, 38);
      autoTable(doc, {
        body: [
          ["Total Products:", totalProducts],
          ["Total Quantity:", totalQuantity],
          ["Estimated Total Value:", `PHP ${totalValue.toFixed(2)}`],
          [
            "Available / Unavailable:",
            `${availableCount} / ${unavailableCount}`,
          ],
        ],
        startY: 42,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 1 },
        columnStyles: { 0: { fontStyle: "bold" } },
      });
    };

    drawHeaderAndSummary();
    const summaryFinalY = doc.lastAutoTable.finalY;

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: summaryFinalY + 5,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133], textColor: 255 },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: "auto" },
        2: { cellWidth: 25 },
        3: { cellWidth: 20, halign: "center" },
        4: { cellWidth: 20, halign: "right" },
        5: { cellWidth: 22 },
        6: { cellWidth: 22 },
      },
      margin: { top: 40 },
      didDrawPage: (data) => {
        if (data.pageNumber > 1) {
          doc.addImage(logoBase64, "PNG", 14, 10, 20, 20);
          doc.setFontSize(18);
          doc.setTextColor(40);
          doc.setFont("helvetica", "bold");
          doc.text(brandingData.name, 38, 18);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100);
          doc.text("Malolos, Central Luzon, Philippines", 38, 24);
          doc.text("Phone: (123) 456-7890 | Email: contact@medcure.ph", 38, 28);
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(40);
          doc.text("Product Inventory Report", pageWidth - 14, 20, {
            align: "right",
          });
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100);
          doc.text(`Exported on: ${exportDateTime}`, pageWidth - 14, 25, {
            align: "right",
          });
          doc.setDrawColor(224, 224, 224);
          doc.line(14, 38, pageWidth - 14, 38);
        }

        doc.setFontSize(8);
        doc.setTextColor(150);
        const footerText = `Page ${
          data.pageNumber
        } of ${doc.internal.getNumberOfPages()}`;
        doc.text(footerText, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
      },
    });

    doc.save(
      `${brandingData.name}_Product_Report_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`
    );
    return { success: true };
  } catch (err) {
    console.error("Failed to generate PDF:", err.message);
    return { success: false, error: err.message };
  }
};

const ExportPDFModal = ({ isOpen, onClose, allProducts }) => {
  const [status, setStatus] = useState("generating");

  useEffect(() => {
    if (isOpen) {
      const createReport = async () => {
        try {
          setStatus("generating");
          const { data: brandingData, error: brandingError } = await supabase
            .from("branding")
            .select("name, logo_url")
            .eq("id", 1)
            .single();
          if (brandingError) throw brandingError;

          const result = await generateProductPDF(allProducts, brandingData);
          if (result.success) {
            setStatus("success");
            setTimeout(() => {
              onClose();
              setStatus("generating");
            }, 2000);
          } else {
            throw new Error(result.error);
          }
        } catch (err) {
          console.error("PDF generation failed:", err);
          setStatus("error");
        }
      };
      createReport();
    }
  }, [isOpen, allProducts, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
        {status === "generating" && (
          <>
            <Loader className="mx-auto h-12 w-12 animate-spin text-blue-600" />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              Generating Report
            </h3>
            <p className="mt-2 text-gray-500">
              Please wait while we prepare your PDF...
            </p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              Report Generated!
            </h3>
            <p className="mt-2 text-gray-500">
              Your download will begin shortly.
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              Export Failed
            </h3>
            <p className="mt-2 text-gray-500">
              Something went wrong. Please check the console for details.
            </p>
            <button
              onClick={() => {
                onClose();
                setStatus("generating");
              }}
              className="mt-6 px-4 py-2 bg-gray-200 rounded-lg font-semibold"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

ExportPDFModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  allProducts: PropTypes.array.isRequired,
};

export default ExportPDFModal;
