import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Institutional branding details
const INSTITUTION = {
  name: 'Dr. RVR NRI INSTITUTE OF TECHNOLOGY',
  subtitle: '(An Institution deemed to be University u/s 3 of UGC Act, 1956)',
  location: 'Pothavarappadu (V), Agiripalli (M), Vijayawada Rural, Eluru District, AP – 521212',
  directorate: 'DIRECTORATE OF RESEARCH & DEVELOPMENT',
  portalTitle: 'Ph.D. ADMISSIONS 2026–2027',
  contact: 'Tel: +91 9640 334422 | Email: deanrnd@nriit.edu.in | Web: rvrnriuniversity.edu.in',
};

// Cached Logo Base64
let cachedLogoBase64 = null;

async function getNriLogoBase64() {
  if (cachedLogoBase64) return cachedLogoBase64;
  if (typeof window === 'undefined') return null;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        cachedLogoBase64 = canvas.toDataURL('image/png');
        resolve(cachedLogoBase64);
      } catch (e) {
        console.warn('[PDF] Canvas toDataURL for logo failed:', e);
        resolve(null);
      }
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = '/nrilogo.png';
  });
}

function addHeaderAndFooter(doc, title, subtitle) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const totalPages = doc.internal.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Header border top bar
    doc.setFillColor(236, 105, 31); // Brand Orange #EC691F
    doc.rect(0, 0, pageWidth, 4, 'F');

    // Header text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 29, 29);
    doc.text(INSTITUTION.name, 14, 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text(`${INSTITUTION.subtitle} · ${INSTITUTION.directorate}`, 14, 14.5);

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(14, 17, pageWidth - 14, 17);

    // Footer
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(INSTITUTION.contact, 14, pageHeight - 7.5);

    const pageStr = `Page ${i} of ${totalPages}`;
    const pageStrWidth = doc.getTextWidth(pageStr);
    doc.text(pageStr, pageWidth - 14 - pageStrWidth, pageHeight - 7.5);
  }
}

/**
 * Generate Part A - Research Aptitude & Methodology Syllabus PDF
 */
export async function generatePartAResearchSyllabusPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 24;

  // Title block
  doc.setFillColor(30, 29, 29); // #1E1D1D
  doc.rect(margin, y, pageWidth - margin * 2, 18, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('Ph.D. ENTRANCE EXAMINATION SYLLABUS', margin + 6, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(236, 105, 31); // Orange
  doc.text('PART A: RESEARCH APTITUDE & METHODOLOGY (COMMON FOR ALL DISCIPLINES)', margin + 6, y + 13.5);

  y += 24;

  // Overview callout
  doc.setFillColor(250, 247, 245); // #FAF7F5
  doc.setDrawColor(236, 105, 31);
  doc.setLineWidth(0.5);
  doc.rect(margin, y, pageWidth - margin * 2, 22, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 29, 29);
  doc.text('EXAMINATION ARCHITECTURE & ASSESSMENT OBJECTIVE:', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  const overviewText =
    'Part A evaluates the candidate\'s foundational knowledge of research philosophy, scientific inquiry, analytical aptitude, formulation of research problems, hypothesis design, literature review rigor, and research publication ethics. It carries 25 Marks (Proposed) out of the total 75 Marks Ph.D. Entrance Examination.';
  const splitOverview = doc.splitTextToSize(overviewText, pageWidth - margin * 2 - 8);
  doc.text(splitOverview, margin + 4, y + 10);

  y += 28;

  // Modules Table
  const modules = [
    {
      unit: 'Unit 1: Fundamentals of Research',
      topics:
        'Definition, objectives, motivation, and types of research (Descriptive, Analytical, Applied, Fundamental, Quantitative, Qualitative, Conceptual, and Empirical). Scientific method and research philosophy. Criteria of good research. Research ethics and intellectual integrity.',
    },
    {
      unit: 'Unit 2: Research Problem & Formulation of Hypotheses',
      topics:
        'Identification of research problem, literature review, locating research gaps, formulation of research objectives. Research hypotheses: Characteristics, types, null vs alternate hypotheses, errors in hypothesis testing (Type I and Type II errors). Feasibility and formulation of research proposal.',
    },
    {
      unit: 'Unit 3: Research Design & Sampling Techniques',
      topics:
        'Meaning, need, and features of good research design. Exploratory, descriptive, and experimental research designs. Principles of experimental design. Sampling design: Census vs sample survey, probability and non-probability sampling techniques, sample size determination, sampling errors.',
    },
    {
      unit: 'Unit 4: Data Collection & Measurement',
      topics:
        'Primary data and secondary data collection methods (observation, interview, questionnaires, schedules, surveys). Reliability and validity of measurement scales. Construction of research instruments and questionnaires. Pre-testing and pilot testing.',
    },
    {
      unit: 'Unit 5: Statistical Analysis & Hypothesis Testing',
      topics:
        'Descriptive statistics: Measures of central tendency, dispersion, skewness, and kurtosis. Inferential statistics: Parametric tests (t-test, z-test, ANOVA/F-test) and Non-parametric tests (Chi-square test, Mann-Whitney U test, Kruskal-Wallis test). Correlation, simple and multiple regression analysis. Significance levels and p-values.',
    },
    {
      unit: 'Unit 6: Research Tools & Data Interpretation',
      topics:
        'Basics of computational research tools: Statistical packages (SPSS, R, Python for Data Analysis), reference management tools (Mendeley, Zotero, EndNote), spreadsheet modeling. Data visualization techniques, graphical representation, and interpretation of empirical results.',
    },
    {
      unit: 'Unit 7: Research & Publication Ethics (RPE)',
      topics:
        'Philosophy and ethics: Moral philosophy, nature of moral judgments, intellectual honesty, and research integrity. Scientific misconduct: Falsification, fabrication, and plagiarism (FFP). Redundant publications (duplicate and overlapping publications, salami slicing). UGC (Promotion of Academic Integrity and Prevention of Plagiarism in Higher Educational Institutions) Regulations. Turnitin/Urkund plagiarism detection software.',
    },
    {
      unit: 'Unit 8: Technical Writing, Citations & Publishing',
      topics:
        'Structure of research thesis, research papers, and technical reports. Indexing databases: Web of Science (WoS), Scopus, PubMed, IEEE Xplore, Google Scholar. Citation indices: h-index, i10-index, impact factor (JCR), CiteScore. Standard citation and referencing styles: IEEE, APA, Harvard, Chicago, MLA. Avoiding predatory journals and publisher metrics.',
    },
  ];

  autoTable(doc, {
    startY: y,
    head: [['Module / Unit', 'Detailed Syllabus Content & Topics']],
    body: modules.map((m) => [m.unit, m.topics]),
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [40, 40, 40],
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
      font: 'helvetica',
    },
    headStyles: {
      fillColor: [30, 29, 29],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    columnStyles: {
      0: { cellWidth: 48, fontStyle: 'bold', textColor: [165, 28, 48] }, // Maroon
      1: { cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin },
  });

  // Footer & Approval notes
  addHeaderAndFooter(doc, 'Part A Syllabus', 'Research Aptitude');

  doc.save('NRIIT_PhD_Syllabus_Part_A_Research_Methodology.pdf');
}

/**
 * Generate Part B - Department Specific Syllabus PDF
 */
export async function generateDepartmentSyllabusPDF(department) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 24;

  // Title block
  doc.setFillColor(30, 29, 29); // #1E1D1D
  doc.rect(margin, y, pageWidth - margin * 2, 20, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('Ph.D. ENTRANCE EXAMINATION SYLLABUS', margin + 6, y + 6.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(236, 105, 31); // Orange
  doc.text(`PART B: ${department.name.toUpperCase()} (${department.code})`, margin + 6, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 200, 200);
  doc.text(`Faculty Category: ${department.category} · Academic Year 2026–2027`, margin + 6, y + 17.5);

  y += 26;

  // Department Overview & Eligibility Callout
  doc.setFillColor(250, 247, 245);
  doc.setDrawColor(236, 105, 31);
  doc.setLineWidth(0.5);
  doc.rect(margin, y, pageWidth - margin * 2, 26, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 29, 29);
  doc.text('DEPARTMENT OVERVIEW & ELIGIBILITY CRITERIA:', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  const desc = department.description || `Doctoral research programme in ${department.name}.`;
  doc.text(doc.splitTextToSize(`Scope: ${desc}`, pageWidth - margin * 2 - 8), margin + 4, y + 10.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(165, 28, 48);
  doc.text(`Prescribed Eligibility: `, margin + 4, y + 17.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  doc.text(
    doc.splitTextToSize(department.eligibility || "Relevant Master's degree with at least 55% marks (50% for SC/ST/OBC/PwD).", pageWidth - margin * 2 - 40),
    margin + 36,
    y + 17.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Examination Structure: Part B carries 50 Marks (Proposed) out of 75 total marks · Duration: 120 Minutes (Combined Part A & B)', margin + 4, y + 23);

  y += 32;

  // Research Areas
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 29, 29);
  doc.text('APPROVED RESEARCH DOMAINS & FACILITY SPECIALIZATIONS:', margin, y);
  y += 3;

  const researchRows = (department.researchAreas || []).map((ra, idx) => [`Domain ${idx + 1}`, ra]);

  autoTable(doc, {
    startY: y,
    head: [['Domain Code', 'Approved Research Area & Indicative Specialization']],
    body: researchRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [40, 40, 40],
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
      font: 'helvetica',
    },
    headStyles: {
      fillColor: [30, 29, 29],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 32, fontStyle: 'bold', textColor: [236, 105, 31] },
      1: { cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin },
  });

  y = doc.lastAutoTable.finalY + 8;

  // Department Core Syllabus Units
  const syllabusUnits = getDepartmentSyllabusUnits(department.code || department.id);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 29, 29);
  doc.text('PART B: CORE DISCIPLINE EXAMINATION SYLLABUS UNITS:', margin, y);
  y += 3;

  autoTable(doc, {
    startY: y,
    head: [['Unit / Subject Area', 'Detailed Curriculum & Examination Topics']],
    body: syllabusUnits.map((u) => [u.title, u.topics]),
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [40, 40, 40],
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
      font: 'helvetica',
    },
    headStyles: {
      fillColor: [165, 28, 48], // Maroon
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    columnStyles: {
      0: { cellWidth: 48, fontStyle: 'bold', textColor: [30, 29, 29] },
      1: { cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin },
  });

  addHeaderAndFooter(doc, `${department.name} Syllabus`, department.code);

  const sanitizedName = department.name.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`NRIIT_PhD_Syllabus_Part_B_${department.code}_${sanitizedName}.pdf`);
}

/**
 * Return detailed syllabus curriculum units by department code
 */
function getDepartmentSyllabusUnits(code) {
  const c = (code || '').toUpperCase();

  if (c.includes('ECON')) {
    return [
      {
        title: 'Unit 1: Microeconomic Analysis',
        topics:
          'Theory of consumer choice: Cardinal, ordinal, revealed preference theory, consumer choice under risk and uncertainty. Theory of production and costs: Production functions (Cobb-Douglas, CES), returns to scale, cost curves. Market structures: Perfect competition, monopoly, monopolistic competition, oligopoly models (Cournot, Bertrand, Stackelberg, kinked demand curve). General equilibrium theory and welfare economics: Pareto optimality, social welfare functions, Arrow’s impossibility theorem, market failure, externalities and public goods.',
      },
      {
        title: 'Unit 2: Macroeconomic Theory & Policy',
        topics:
          'National income accounting and determination. Classical, Keynesian, Monetarist, and New Classical macroeconomic models. Aggregate demand and aggregate supply. IS-LM framework with open economy (Mundell-Fleming model). Theories of consumption and investment (Permanent income, life-cycle, accelerator, Tobin’s q). Theories of money demand and money supply. Inflation, unemployment, and Phillips curve analysis. Monetary and fiscal policy coordination.',
      },
      {
        title: 'Unit 3: Quantitative Methods & Econometrics',
        topics:
          'Probability theory, probability distributions (Binomial, Poisson, Normal). Sampling distributions, estimation, and hypothesis testing. Classical Linear Regression Model (CLRM): OLS estimation, assumptions, Gauss-Markov theorem. Violations of CLRM: Multicollinearity, heteroscedasticity, autocorrelation (nature, detection, consequences, and remedies). Dummy variables, simultaneous equation models and identification problem. Time series econometrics: Stationarity, unit roots, cointegration.',
      },
      {
        title: 'Unit 4: Development Economics & Public Finance',
        topics:
          'Theories of economic growth and development: Harrod-Domar, Solow, Lewis, Rostow, Big Push, Balanced vs Unbalanced growth models. Human development index (HDI), poverty, and inequality measures (Gini coefficient, Lorenz curve). Public Finance: Public goods, merit goods, taxation (canons, incidence, shifting, deadweight loss). Public expenditure, public debt, deficit financing, fiscal federalism, and Finance Commission recommendations.',
      },
      {
        title: 'Unit 5: International Economics & Indian Economy',
        topics:
          'Theories of international trade: Classical, Heckscher-Ohlin, Stolper-Samuelson, Rybczynski theorems. Terms of trade, gains from trade, tariffs and non-tariff barriers, WTO regulations. Balance of Payments (BOP): Equilibrium, disequilibrium, and adjustment mechanisms. Foreign exchange market and exchange rate determination. Indian Economy: Economic reforms since 1991, agricultural transformation, industrial growth, service sector dynamics, inflation management, banking and monetary reforms, NITI Aayog initiatives.',
      },
    ];
  }

  if (c.includes('CSE')) {
    return [
      {
        title: 'Unit 1: Data Structures, Algorithms & Theory of Computation',
        topics:
          'Asymptotic analysis of algorithms. Linear & non-linear data structures: Trees, graphs, heaps, hash tables. Algorithm design techniques: Divide-and-conquer, dynamic programming, greedy algorithms, branch-and-bound. Graph algorithms. NP-completeness and approximation. Regular expressions, finite automata, context-free grammars, Turing machines, and undecidability.',
      },
      {
        title: 'Unit 2: Computer Systems & Architecture',
        topics:
          'Instruction set architecture, pipelining, hazards, memory hierarchy, cache coherence, virtual memory. Operating systems: Processes, threads, CPU scheduling, synchronization, deadlocks, memory management, file systems, distributed systems.',
      },
      {
        title: 'Unit 3: Database Systems & Computer Networks',
        topics:
          'ER models, relational algebra, SQL, normalization (1NF to BCNF), indexing (B/B+ trees), query processing and transaction management, ACID properties, concurrency control. Computer networks: OSI and TCP/IP protocol stacks, routing algorithms, flow and congestion control, transport layer protocols, network security, cryptography basics.',
      },
      {
        title: 'Unit 4: Artificial Intelligence & Machine Learning',
        topics:
          'Informed and uninformed search algorithms, adversarial search, knowledge representation, reasoning under uncertainty. Machine Learning: Supervised learning (linear models, SVMs, decision trees, ensemble learning), unsupervised learning (clustering, PCA), neural networks and deep learning architectures (CNNs, RNNs, Transformers), evaluation metrics.',
      },
      {
        title: 'Unit 5: Data Science, Cybersecurity & Cloud Computing',
        topics:
          'Data mining, big data architectures, distributed computing (Hadoop, Spark). Cybersecurity: Threat modeling, network security, penetration testing, malware analysis, blockchain basics. Cloud computing models (IaaS, PaaS, SaaS), virtualization, containerization (Docker, Kubernetes).',
      },
    ];
  }

  if (c.includes('ECE')) {
    return [
      {
        title: 'Unit 1: Signals, Systems & Digital Signal Processing',
        topics:
          'Continuous and discrete-time signals, LTI systems, convolution. Fourier transform, Laplace transform, z-transform. DFT, FFT algorithms, digital filter design (FIR, IIR), multi-rate signal processing, adaptive filters, spectral analysis.',
      },
      {
        title: 'Unit 2: Analog & Digital Communications',
        topics:
          'Modulation techniques (AM, FM, PM). Digital transmission: PCM, DPCM, DM, ASK, FSK, PSK, QAM. Information theory: Channel capacity, Shannon’s theorems, source coding, error control codes (convolutional, turbo, LDPC). Wireless communication, cellular concepts, MIMO systems, 5G architectures.',
      },
      {
        title: 'Unit 3: Semiconductor Devices & VLSI Design',
        topics:
          'MOSFET physics, CMOS inverter characteristics, layout design rules, static and dynamic CMOS logic circuits, combinational and sequential VLSI circuits. Low-power VLSI design, FPGA architecture, Verilog/VHDL hardware description languages, testing and verification of VLSI circuits.',
      },
      {
        title: 'Unit 4: Embedded Systems & Microcontrollers',
        topics:
          'Microprocessors (8086, ARM Cortex), microcontrollers, peripheral interfacing. Real-time operating systems (RTOS), embedded C programming, IoT architectures, wireless sensor networks (WSN), hardware-software co-design.',
      },
      {
        title: 'Unit 5: Electromagnetics, Antennas & Microwave Engineering',
        topics:
          'Maxwell’s equations, wave propagation in various media, transmission lines, Smith chart. Antennas: Dipole, patch, array antennas, radiation pattern, beamforming. Microwave components, waveguides, radar fundamentals, optical fiber communications.',
      },
    ];
  }

  if (c.includes('EEE')) {
    return [
      {
        title: 'Unit 1: Electric Circuits & Electromagnetic Fields',
        topics:
          'Network theorems, transient analysis, steady-state sinusoidal analysis, three-phase circuits, resonance, two-port networks. Electromagnetic fields: Coulomb’s law, Gauss’s law, Biot-Savart law, Ampere’s law, Faraday’s law, magnetic circuits.',
      },
      {
        title: 'Unit 2: Electrical Machines',
        topics:
          'Single-phase and three-phase transformers. DC machines: Characteristics, starting, speed control, braking. Three-phase induction motors: Performance, speed control. Synchronous machines: Cylindrical and salient pole rotors, voltage regulation, parallel operation. Special electrical machines (BLDC, PMSM, Stepper motors).',
      },
      {
        title: 'Unit 3: Power Systems & Protection',
        topics:
          'Transmission line modeling, corona, power flow analysis (Gauss-Seidel, Newton-Raphson), symmetrical and unsymmetrical faults. Power system stability: Swing equation, equal area criterion. Economic dispatch, modern power system protection, digital relays, FACTS devices, HVDC transmission.',
      },
      {
        title: 'Unit 4: Control Systems & Power Electronics',
        topics:
          'Transfer functions, block diagrams, signal flow graphs. Time response, frequency response (Bode plot, Nyquist criterion, root locus). State-space analysis, controllability, observability. Power semiconductor devices: SCR, MOSFET, IGBT. Phase-controlled rectifiers, DC-DC converters (Buck, Boost, Buck-Boost), inverters, PWM techniques.',
      },
      {
        title: 'Unit 5: Renewable Energy & Smart Grids',
        topics:
          'Solar PV systems, MPPT algorithms, wind energy conversion systems. Battery energy storage systems (BESS), electric vehicle drives and charging infrastructure. Microgrids, distributed generation, smart grid communications and cybersecurity in power grids.',
      },
    ];
  }

  if (c.includes('ME')) {
    return [
      {
        title: 'Unit 1: Applied Mechanics & Design',
        topics:
          'Engineering mechanics: Free body diagrams, friction, kinematics and dynamics. Mechanics of materials: Stress, strain, Mohr’s circle, bending and shear stresses, deflection of beams, torsion, columns. Theory of machines: Mechanisms, velocity/acceleration analysis, gears, flywheels, governors, vibrations (free, forced, damped). Machine design: Failure theories, fatigue, design of shafts, bearings, gears.',
      },
      {
        title: 'Unit 2: Fluid Mechanics & Thermal Sciences',
        topics:
          'Fluid properties, fluid statics, Bernoulli’s equation, boundary layer theory, laminar and turbulent flows. Thermodynamics: Laws of thermodynamics, entropy, exergy analysis, thermodynamic cycles (Otto, Diesel, Dual, Rankine, Brayton). Heat transfer: Conduction, convection, radiation, heat exchangers. Refrigeration and air conditioning.',
      },
      {
        title: 'Unit 3: Materials, Manufacturing & Industrial Engineering',
        topics:
          'Engineering materials: Phase diagrams, heat treatment, mechanical properties. Manufacturing processes: Casting, forming, joining/welding, machining and machine tools, CNC machining, additive manufacturing, non-traditional machining. Metrology and inspection.',
      },
      {
        title: 'Unit 4: Industrial Engineering & Operations Research',
        topics:
          'Production planning and control, forecasting, inventory models, linear programming (Simplex, duality), transportation and assignment models, network analysis (CPM/PERT), queuing theory. Quality management: Six Sigma, SPC, lean manufacturing.',
      },
    ];
  }

  if (c.includes('CE')) {
    return [
      {
        title: 'Unit 1: Structural Engineering & Mechanics',
        topics:
          'Engineering mechanics, strength of materials, structural analysis of determinate and indeterminate structures (slope deflection, moment distribution, matrix methods). Design of concrete structures (limit state method, beams, slabs, columns, foundations). Design of steel structures (tension, compression members, welded/bolted connections).',
      },
      {
        title: 'Unit 2: Geotechnical Engineering & Foundation Design',
        topics:
          'Soil mechanics: Index properties, soil classification, permeability, seepage, consolidation, shear strength. Earth pressure theories, slope stability. Foundation engineering: Shallow foundations, bearing capacity theories, deep foundations (pile foundations, settlement analysis).',
      },
      {
        title: 'Unit 3: Water Resources & Environmental Engineering',
        topics:
          'Fluid mechanics and hydraulics: Open channel flow, hydraulic jumps, pipe flow. Hydrology: Runoff, hydrographs, groundwater flow. Irrigation engineering: Crop water requirements, canal design. Environmental engineering: Water quality parameters, water treatment processes, wastewater treatment, air pollution control, solid waste management.',
      },
      {
        title: 'Unit 4: Transportation & Construction Management',
        topics:
          'Highway geometric design, pavement design (flexible and rigid pavements), traffic engineering. Surveying: Levelling, theodolite, total station, GIS and remote sensing applications. Construction management: Project planning, CPM/PERT, cost estimation and contracts.',
      },
    ];
  }

  if (c.includes('MBA') || c.includes('MGMT')) {
    return [
      {
        title: 'Unit 1: Management Theory, Principles & Organizational Behavior',
        topics:
          'Evolution of management thought, planning, organizing, leading, controlling. Organizational behavior: Individual behavior, personality, perception, attitudes, motivation theories (Maslow, Herzberg, Vroom), group dynamics, leadership styles, organizational culture, change management.',
      },
      {
        title: 'Unit 2: Marketing Management',
        topics:
          'Marketing environment, consumer behavior, market segmentation, targeting, positioning (STP). Product life cycle, branding, pricing strategies, distribution channels, integrated marketing communications (IMC), digital marketing, services marketing, marketing analytics.',
      },
      {
        title: 'Unit 3: Financial Management & Accounting',
        topics:
          'Financial accounting principles, financial statement analysis, ratio analysis. Corporate finance: Time value of money, cost of capital, capital budgeting decisions, capital structure theories, dividend policy, working capital management, financial derivatives.',
      },
      {
        title: 'Unit 4: Human Resource Management & Strategic Management',
        topics:
          'Human resource planning, recruitment, selection, training and development, performance appraisal, compensation management, industrial relations. Strategic management: Industry analysis (Porter’s five forces), SWOT analysis, competitive strategies, corporate governance, corporate social responsibility (CSR).',
      },
      {
        title: 'Unit 5: Operations, Logistics & Business Analytics',
        topics:
          'Operations management: Facility layout, capacity planning, supply chain management, total quality management (TQM). Business analytics: Predictive modeling, decision trees, optimization methods in business decisions.',
      },
    ];
  }

  if (c.includes('MATH')) {
    return [
      {
        title: 'Unit 1: Analysis & Linear Algebra',
        topics:
          'Real Analysis: Sequences and series, metric spaces, continuity, uniform continuity, Riemann integration, Lebesgue measure. Complex Analysis: Analytic functions, Cauchy-Riemann equations, Cauchy’s theorem and integral formula, residue theorem. Linear Algebra: Vector spaces, linear transformations, matrices, eigenvalues and eigenvectors, diagonalization, inner product spaces.',
      },
      {
        title: 'Unit 2: Differential Equations & Numerical Methods',
        topics:
          'Ordinary differential equations: First order ODEs, linear ODEs of higher order, series solutions, boundary value problems. Partial differential equations: Method of characteristics, separation of variables, Laplace, wave, and heat equations. Numerical analysis: Root finding, interpolation, numerical integration and differentiation, numerical solution of ODEs.',
      },
      {
        title: 'Unit 3: Abstract Algebra, Topology & Probability',
        topics:
          'Abstract Algebra: Groups, subgroups, normal subgroups, quotient groups, homomorphisms, rings, ideals, fields. Topology: Topological spaces, basis, continuous functions, compactness, connectedness. Probability & Statistics: Random variables, probability distributions, testing of hypotheses, stochastic processes.',
      },
    ];
  }

  if (c.includes('PHY')) {
    return [
      {
        title: 'Unit 1: Classical Mechanics & Mathematical Physics',
        topics:
          'Lagrangian and Hamiltonian formulations, central force problems, rigid body dynamics, small oscillations. Vector calculus, differential equations, Fourier and Laplace transforms, complex analysis, tensor analysis.',
      },
      {
        title: 'Unit 2: Quantum Mechanics & Electromagnetic Theory',
        topics:
          'Schrödinger equation, harmonic oscillator, hydrogen atom, angular momentum, perturbation theory, scattering theory. Maxwell’s equations, electromagnetic waves, radiation from accelerating charges, relativistic electrodynamics.',
      },
      {
        title: 'Unit 3: Solid State Physics, Electronics & Nuclear Physics',
        topics:
          'Crystal structures, reciprocal lattice, phonons, electron theory of metals, band theory of solids, superconductivity, semiconductors. Nuclear properties, nuclear models, radioactive decay, nuclear reactions, elementary particle physics.',
      },
    ];
  }

  if (c.includes('CHEM')) {
    return [
      {
        title: 'Unit 1: Inorganic Chemistry',
        topics:
          'Periodic properties, chemical bonding, coordination chemistry (crystal field theory, ligand field theory, electronic spectra, magnetic properties), organometallic chemistry, bioinorganic chemistry, solid-state chemistry.',
      },
      {
        title: 'Unit 2: Organic Chemistry',
        topics:
          'Reaction mechanisms, reactive intermediates, stereochemistry, organic synthesis (name reactions, reagents), pericyclic reactions, heterocyclic compounds, biomolecules (proteins, nucleic acids), spectroscopy (UV, IR, NMR, Mass).',
      },
      {
        title: 'Unit 3: Physical Chemistry',
        topics:
          'Quantum chemistry, chemical thermodynamics, chemical kinetics and catalysis, electrochemistry, surface chemistry, statistical thermodynamics, molecular spectroscopy.',
      },
    ];
  }

  if (c.includes('PHARM')) {
    return [
      {
        title: 'Unit 1: Pharmaceutics & Drug Delivery Systems',
        topics:
          'Preformulation studies, novel drug delivery systems (nanoparticles, liposomes, targeted drug delivery), biopharmaceutics and pharmacokinetics, pharmaceutical technology, packaging and stability testing.',
      },
      {
        title: 'Unit 2: Pharmacology & Toxicology',
        topics:
          'General pharmacology, mechanisms of drug action, neuropharmacology, cardiovascular pharmacology, chemotherapy, screening methods, toxicological evaluations, clinical pharmacology.',
      },
      {
        title: 'Unit 3: Pharmaceutical Chemistry & Analysis',
        topics:
          'Medicinal chemistry: SAR, drug design, molecular modeling. Instrumental analysis: HPLC, GC, LC-MS, NMR, spectroscopy, regulatory guidelines (ICH, cGMP, GLP).',
      },
      {
        title: 'Unit 4: Pharmacognosy & Phytochemistry',
        topics:
          'Natural drug sources, extraction and isolation of phytoconstituents, standardization of herbal drugs, plant tissue culture, nutraceuticals.',
      },
    ];
  }

  // Default Fallback
  return [
    {
      title: 'Unit 1: Advanced Theoretical Foundations',
      topics: `Core theoretical paradigms and advanced principles of ${c} research discipline.`,
    },
    {
      title: 'Unit 2: Contemporary Research Methods in the Discipline',
      topics: 'Analytical, computational, experimental, and empirical methodologies.',
    },
    {
      title: 'Unit 3: Domain Specializations & Applications',
      topics: 'Current literature, open challenges, industry applications, and research trends.',
    },
  ];
}

/**
 * Generate Ph.D. Admission Guidelines & Regulations Overview PDF
 */
export async function generateRegulationsSummaryPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 24;

  // Title block
  doc.setFillColor(30, 29, 29);
  doc.rect(margin, y, pageWidth - margin * 2, 18, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('Ph.D. ADMISSIONS REGULATIONS & GUIDELINES 2026–2027', margin + 6, y + 7.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(236, 105, 31);
  doc.text('Dr. RVR NRI INSTITUTE OF TECHNOLOGY (DEEMED TO BE UNIVERSITY)', margin + 6, y + 13.5);

  y += 24;

  const sections = [
    {
      title: '1. Admission Categories',
      content:
        'The University offers Ph.D. admissions under two categories: (a) Full-Time Ph.D. with institutional research residency and fellowship eligibility; (b) Part-Time Ph.D. for working faculty, scientists, and industry professionals with employer No Objection Certificate (NOC).',
    },
    {
      title: '2. Eligibility Criteria',
      content:
        "Master's degree or equivalent qualification with at least 55% marks in aggregate or equivalent grade 'B' in UGC 7-point scale (50% for SC/ST/OBC non-creamy layer/Differently-Abled/EWS). Direct admission after 4-year undergraduate degree with 75% marks is subject to UGC norms and university approval.",
    },
    {
      title: '3. Selection Test Architecture & Exemptions',
      content:
        'Selection is conducted via a two-part University Entrance Examination: Part A (Research Aptitude & Methodology — 25 Marks) and Part B (Subject-Specific Knowledge — 50 Marks). Total Marks: 75; Duration: 120 Minutes. Candidates qualifying UGC-NET, CSIR-NET (including JRF), GATE, SLET, SET, GPAT, or teacher fellowships may be exempt from the written test.',
    },
    {
      title: '4. Research Proposal Presentation & Interview',
      content:
        'All shortlisted candidates (written exam qualified and exempted) must present a research proposal before the Departmental Research Committee (DRC) evaluating research competency, topic feasibility, and supervisor availability.',
    },
    {
      title: '5. Ph.D. Fee Structure (Proposed)',
      content:
        'Admission Fee (One-Time): ₹10,000. Annual Programme Fee: ₹20,000 for Full-Time; ₹15,000 for Part-Time. Coursework, examination, and thesis evaluation fees as notified by the University upon enrollment.',
    },
  ];

  autoTable(doc, {
    startY: y,
    head: [['Section', 'Academic & Regulatory Provisions']],
    body: sections.map((s) => [s.title, s.content]),
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 3.5,
      textColor: [40, 40, 40],
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
      font: 'helvetica',
    },
    headStyles: {
      fillColor: [30, 29, 29],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: 'bold', textColor: [165, 28, 48] },
      1: { cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin },
  });

  addHeaderAndFooter(doc, 'Ph.D. Regulations', 'Official Guidelines');
  doc.save('NRIIT_PhD_Regulations_Guidelines_2026_2027.pdf');
}
