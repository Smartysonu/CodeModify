/**
 * ----------------------------------------------------------------------------
 * Copyright (c) Tata Consultancy Services (TCS) or Cummins Inc.
 * All Rights Reserved.
 *
 * Copying or reproduction without any prior written approval is prohibited.
 *-----------------------------------------------------------------------------
 */
package ext.cummins.itemNote;

import java.lang.reflect.InvocationTargetException;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringJoiner;

import org.apache.logging.log4j.*;

import wt.change2.ChangeHelper2;
import wt.change2.WTChangeActivity2;
import wt.fc.QueryResult;
import wt.fc.WTObject;

import wt.method.MethodContext;
import wt.method.RemoteAccess;
import wt.method.RemoteMethodServer;
import wt.part.WTPart;
import wt.lifecycle.State;
import wt.util.WTException;
import wt.util.WTMessage;
import wt.util.WTPropertyVetoException;
import wt.vc.wip.WorkInProgressHelper;
import ext.cummins.part.CumminsPartConstantIF;
import ext.cummins.utils.CumminsIBAHelper;
import ext.cummins.utils.CumminsUtils;
import ext.cummins.validation.CumminsValidationConstantIF;
import ext.cummins.validation.CumminsValidationHelper;

/**
 *
 * <b>Class:</b> CumminsItemNotePopulation.java <br>
 * <br>
 * <b> Description:</b> Name generation of Part Based on Classification NounName
 * attribute <br>
 * <br>
 *
 * @author Tata Consultancy Services (TCS) <br>
 * <br>
 */
public class CumminsItemNotePopulation implements RemoteAccess {

	/** The Constant CLASSNAME. */
	private static final String CLASSNAME = CumminsItemNotePopulation.class
			.getName();

	/** The Constant SERVER */
	private static boolean server = false;

	/** The Constant LOGGER. */
	private static final Logger LOGGER = LogManager.getLogger(CLASSNAME);

	/** The Constant RESOURCE. */
	private static final String RESOURCE = CumminsItemNoteResource.class
			.getName();

	/** The preference for MDE ORGS. */
	public static final String MDE_ORGS_PREFERNCE = CumminsItemNoteConstantIF.MDE_ORGS_PREFERNCE;

	/** The Constant for Performance LOGGER class. */
	private static final Logger LOGGER_PERF = LogManager.getLogger("ext.cummins.utils.CumminsPerformaceLogger");

	/** The Constant for Performance Enabler. */
	private static final boolean PERF_ENABLE = LOGGER_PERF.isInfoEnabled();

	/** The Constant FREE_NOTE_PREFIX. */
	public static final String FREE_NOTE_PREFIX = CumminsItemNoteConstantIF.FREE_NOTE;

	/** The Constant EXTRA_NOTE_PREFIX. */
	public static final String EXTRA_NOTE_PREFIX = CumminsItemNoteConstantIF.EXTRA_NOTE;

	/** The SEPERATOR used in Item Note Templates. */
	public static final String SEPERATOR_COLON = ":";

	/** The SEPERATOR used in Item Note Templates. */
	public static final String SEPERATOR_COLON_REGEX = "\\s*\\:\\s*";

	/** The SEPERATOR used in Item Note Templates. */
	public static final String SEPERATOR_PIPE = "|";

	/** The SEPERATOR used in Item Note Templates. */
	public static final String SEPERATOR_PIPE_REGEX = "\\s*\\|\\s*";

	/** The SEPERATOR used in Item Note Templates. */
	public static final String SEPERATOR_HASH_REGEX = "\\s*\\#\\s*";

	/** The SEPERATOR used in Item Note Templates. */
	public static final String SEPERATOR_UNDERSCORE = "_";

	/** The SEPERATOR used in Item Note Templates. */
	public static final String SEPERATOR_APPEND = "&";

	/** The SEPERATOR used in Item Note Templates. */
	public static final String SEPERATOR_COMMA = ",";

	/** The SEPERATOR used in Item Note Templates. */
	public static final String SEPERATOR_AT = "@";

	/** The SEPERATOR used in Item Note Templates. */
	public static final String NEW_LINE = "\n";

	/** The SEPERATOR used in Item Note Templates. */
	public static final String R_TRIM = "\\s+$";
	
	/** The PREFIXES used in the Template. */
	public static final String HEADER = "HEADER";
	public static final String LABEL = "LABEL";
	public static final String GENERIC = "GENERIC";
	public static final String SPLIT = "SPLIT";
	public static final String FC_FP = "FC_FP";
	public static final String MISC = "MISC";
	public static final String POWER1 = "POWER1";
	public static final String POWER2 = "POWER2";
	public static final String TORQUE1 = "TORQUE1";
	public static final String TORQUE2 = "TORQUE2";
	public static final String TORQUE3 = "TORQUE3";
	public static final String RPM = "RPM";
	public static final String PREFIX = "PREFIX";
	public static final String EXTRA = "EXTRA";

	// Interger Number and Effect Code Constants
	/** The positionMap. */
	private static HashMap<Integer, String> positionMap;

	static {
		positionMap = new HashMap<Integer, String>();
		positionMap.put(1, "{1}");
		positionMap.put(2, "{2}");
		positionMap.put(3, "{3}");
		positionMap.put(4, "{4}");
	}

	/**
	 *
	 * @param args
	 *            <b><br>
	 *            Usage: windchill
	 *            ext.cummins.itemNote.CumminsItemNotePopulation [args]
	 *            <ul>
	 *            args:</b>
	 *            </ul>
	 *            <ul>
	 *            <b> -part </b> Part Number for populating Item Note
	 *            <ul>
	 *            REQUIRED : The Number of the part for which the Item Note
	 *            needs to be Generated
	 *            </ul>
	 *            </ul> </ul>
	 *            <ul>
	 *            <b> -username </b> name of Site Admin user to authenticate as
	 *            <ul>
	 *            OPTIONAL : Site Admin User Name. If present in conjunction
	 *            with the '-password' argument
	 *            <ul>
	 *            the utility will attempt authenticate as the user, and no <br>
	 *            prompt will be made if successful. Otherwise there will be <br>
	 *            a login prompt.
	 *            </ul>
	 *            </ul> </ul>
	 *            <ul>
	 *            <b> -password </b> password of Site Admin user to authenticate
	 *            as
	 *            <ul>
	 *            OPTIONAL : Site Admin User Password. If present in conjunction
	 *            with the '-username' argument
	 *            <ul>
	 *            the utility will attempt authenticate with the password, <br>
	 *            and no prompt will be made if successful. Otherwise there <br>
	 *            will be a login prompt.
	 *            </ul>
	 *            </ul>
	 * 
	 *
	 * @throws InvocationTargetException
	 * @throws RemoteException
	 */

	public static void main(String[] args) throws RemoteException,
			InvocationTargetException {

		String userMesg;

		server = ((RemoteMethodServer.ServerFlag) && (MethodContext
				.getActiveCount() > 0));

		String partNumber = getStringArgument(args, "-part");

		try {

			if (partNumber == null) {
				userMesg = "ERROR: Provide valid part number";
				CumminsItemNoteUtils.printMessage(userMesg, server);
				if (!server) {
					System.exit(0);
				}
				return;
			}

			String userName = getStringArgument(args, "-username");
			String password = getStringArgument(args, "-password");

			Class<?> cobj[] = { String.class };
			Object cval[] = { partNumber };

			LOGGER.debug("Credentials processed");
			RemoteMethodServer rms = RemoteMethodServer.getDefault();
			long startTime = System.currentTimeMillis();

			rms.setUserName(userName);
			rms.setPassword(password);
			rms.invoke("populateItemNote1",
					CumminsItemNotePopulation.class.getName(), null, cobj, cval);

			long endTime = System.currentTimeMillis();
			userMesg = "\n\n\nINFO: Report generated in "
					+ (endTime - startTime) / 1000 + " seconds";
			CumminsItemNoteUtils.printMessage(userMesg, server);
		} catch (Exception e) {
			CumminsItemNoteUtils.printMessage(e.getLocalizedMessage(), server);
			LOGGER.error(e);
		}
	}

	public static void populateItemNote1(String targetPart) throws WTException {

		WTPart part = CumminsItemNoteUtils.getPartByNumber(targetPart);
		try {
			populateItemNote(part);
		} catch (Exception e) {
			CumminsItemNoteUtils.printMessage(e.getLocalizedMessage(), server);
			LOGGER.error(e);
		}

	}

	/**
	 * Method invoked from Change Activity after CA 1 completes the Task
	 * 
	 * 
	 * @param object
	 * @return
	 */
	public static String startItemNotePopulation(WTObject object) {

		long customST = 0;
		if (PERF_ENABLE) {
			customST = System.currentTimeMillis();
			LOGGER_PERF.info("Custom-Code >> START-Time >> " + customST);
		}

		StringBuffer retunMessage = new StringBuffer();
		WTChangeActivity2 changeActivity = null;
		try {
			QueryResult result = new QueryResult();
			if (object instanceof WTChangeActivity2) {
				changeActivity = (WTChangeActivity2) object;

				long ootbST = 0;
				if (PERF_ENABLE) {
					ootbST = System.currentTimeMillis();
					LOGGER_PERF.info("OOTB-Code >> START-Time >> " + ootbST);
				}
				result = ChangeHelper2.service
						.getChangeablesAfter(changeActivity);
				if (PERF_ENABLE) {
					long ootbET = System.currentTimeMillis();
					LOGGER_PERF.info("OOTB-Code >> TOTAL-Time >> "
							+ (ootbET - ootbST));
				}
			}

			List<WTPart> parts = new ArrayList<WTPart>();

			while (result.hasMoreElements()) {
				Object obj = result.nextElement();
				if (obj instanceof WTPart) {
					WTPart part = (WTPart) obj;

					boolean isValidationApplicable = CumminsValidationHelper.service
							.isValidationApplicable(
									part,
									CumminsValidationConstantIF.MDE_VALIDATIONS,
									CumminsValidationConstantIF.ITEMNOTE_VALIDATION);

					// Formating for MDE_MVP starts
					LOGGER.debug("CumminsItemNotePopulation.startItemNotePopulation()"
							+ part.getNumber()
							+ " >> "
							+ isValidationApplicable);

					if (isValidationApplicable) {
						parts.add(part);
					}
				}
			}
                        for (WTPart part : parts) {
					//populating Item Note for each part.
			String message = populateItemNote(part);

				if (!"".equalsIgnoreCase(message) || !message.isEmpty()) {
					retunMessage.append(part.getNumber() + "\n");
				}

	        }

		} catch (Exception e) {
			String objIdentity = changeActivity != null ? "Change Activity: "
					+ changeActivity.getNumber() : "Object is null";
			Object[] arrayOfObject = { objIdentity, e.getLocalizedMessage() };
			WTMessage feedMsg = new WTMessage(RESOURCE,
					CumminsItemNoteResource.ITEM_NOTE_RELEASE_ERROR,
					arrayOfObject);
			retunMessage.append(feedMsg);
			LOGGER.error(feedMsg.getLocalizedMessage(), e);
		}

		if (PERF_ENABLE) {
			long customET = System.currentTimeMillis();
			LOGGER_PERF.info("Custom-Code >> TOTAL-Time >> "
					+ (customET - customST));
		}
		return retunMessage.toString();
	}

	/**
	 * Method to populate the Item Note value
	 * 
	 * 
	 * @param targetPart
	 * @return
	 * @throws WTException
	 * @throws WTPropertyVetoException
	 */
	public static String populateItemNote(WTPart targetPart) throws WTException {
		long customST = 0;
		if (PERF_ENABLE) {
			customST = System.currentTimeMillis();
			LOGGER_PERF.info("Custom-Code >> START-Time >> " + customST);
		}

		// Formating for Item Note starts
		LOGGER.debug("CumminsItemNotePopulation.populateItemNote() >>"
				+ targetPart.getNumber());

		LOGGER.debug("Enter >> populateItemNote()");

		StringBuilder retunMessage = new StringBuilder();
		StringBuilder itemNote = new StringBuilder();
		List<String> template;
		String primaryClassification = "";

		if (WorkInProgressHelper.isCheckedOut(targetPart)) {
			throw new WTException("The Part [" + targetPart.getNumber()
					+ "] is checked out");
		}
		try {

			// Get all Attributes of Part
			Map<String, String> partAttributeMap = CumminsIBAHelper
					.getAllValue(targetPart);

			// Fetch Primary Classification of Part
			primaryClassification = partAttributeMap
					.containsKey(CumminsPartConstantIF.PRIMARY_CLASSIFICATION) ? partAttributeMap
					.get(CumminsPartConstantIF.PRIMARY_CLASSIFICATION)
					: primaryClassification;

			LOGGER.error("Test");

			// Checking if Item Note Classification
			if (primaryClassification
					.contains(CumminsItemNoteConstantIF.NOTE_PREFIX)) {

				// Read the Item Note Template
				template = CumminsItemNoteUtils
						.getTemplate(primaryClassification);

				LOGGER.error(template);

				int lineCounter = 0;
				if (!template.isEmpty()) {
					for (String line : template) {
						try {
							lineCounter += 1;
							String[] split = line.split(SEPERATOR_HASH_REGEX);
							String prefix = split[0].trim();
							String noteLine;
							String value;
							String attribInternalName;

							// Start New Code

							switch (prefix) {

							/**
							 * Header Line - First line in Template
							 * 
							 **/
							case HEADER:

								noteLine = split[1].trim().replace(
										SEPERATOR_COLON, "");

								LOGGER.debug(noteLine);
								itemNote.append(noteLine + NEW_LINE);
								break;

							/**
							 * Label Lines - Only Label no Attribute Value
							 * 
							 **/
							case LABEL:

								noteLine = split[1].trim();
								noteLine+=" ";

								LOGGER.debug(noteLine);
								itemNote.append(noteLine + NEW_LINE);
								break;

							/**
							 * Generic Attributes -
							 * 
							 **/
							case GENERIC:

								attribInternalName = split[2].trim();
								value = partAttributeMap
										.containsKey(attribInternalName) ? partAttributeMap
										.get(attribInternalName) : "";

								if (value.contains(SEPERATOR_UNDERSCORE)) {

									/**
									 * Check for Enum Values
									 */

									String[] enumValues = value
											.split(SEPERATOR_PIPE_REGEX);

									StringJoiner displayJoiner = new StringJoiner(
											",");

									for (String temp : enumValues) {

										displayJoiner
												.add(temp.contains("_") ? CumminsIBAHelper
														.getEnumerationPropDisplayValue(temp)
														: temp);

									}
									value = displayJoiner.toString();

								} else {
									value = value.replace(SEPERATOR_PIPE,
											SEPERATOR_COMMA);
								}

								noteLine = split[1].trim() + " " + value;

								LOGGER.debug(noteLine);
								itemNote.append(noteLine + NEW_LINE);
								break;

							/**
							 * Split Attributes - Certified By & Certified By2
							 **/
							case SPLIT:

								String[] input = split[1].trim().split(
										SEPERATOR_COLON_REGEX);
								
								value = partAttributeMap.get(split[2].trim());
										
								value = value.replace(SEPERATOR_PIPE,SEPERATOR_COMMA);

								List<String> values = Arrays
										.asList(value.split(SEPERATOR_COMMA));

								noteLine = input[0].trim() + SEPERATOR_COLON + " ";
								noteLine += getSplitLines(input, values);

								LOGGER.debug(noteLine);
								itemNote.append(noteLine + NEW_LINE);
								break;

							/**
							 * FC/FP Attributes - FC/FP and FC/FP Cont
							 **/
							case FC_FP:

								String[] fcfpInput = split[1].trim().split(
										SEPERATOR_COLON_REGEX);

								String fcfpPrefix = partAttributeMap
										.get(split[2].trim());

								List<String> fcfpValues = Arrays
										.asList(partAttributeMap.get(
												split[3].trim()).split(
												SEPERATOR_PIPE_REGEX));

								fcfpPrefix = fcfpInput[0].replace("{1}", fcfpPrefix);
								
								noteLine = fcfpPrefix
										+ SEPERATOR_COLON + " ";

								value = getSplitLines(fcfpInput, fcfpValues);
								if (!value.isEmpty()) {
									noteLine += value;
								}
								LOGGER.debug(noteLine);
								itemNote.append(noteLine + NEW_LINE);
								break;
								
							/**
							 * Prefix - FC/FP and PI/PJ
							 **/
								
							case PREFIX: // {1}: {2}
								
								noteLine = split[1].trim() + " ";

								for (int i = 2; i < split.length; i++) {

									attribInternalName = split[i].trim();
									value = partAttributeMap
											.containsKey(attribInternalName) ? partAttributeMap
											.get(attribInternalName).trim()
											: " ";
									value = value.replace(SEPERATOR_PIPE, SEPERATOR_COMMA);

									noteLine = noteLine.replace(
											positionMap.get(i - 1), value);

								}
								LOGGER.debug(noteLine);

								itemNote.append(noteLine + NEW_LINE);
								break;
								


							/**
							 * Unit Fields - Same Logic applies to all below
							 * Formats
							 **/
							case POWER1: // {1} BHP @ {2} RPM
							case POWER2: // {1} PS ( {2} BHP) @ {3} RPM
							case TORQUE1:// {1} LB FT
							case TORQUE2:// {1} LB FT @ {2} RPM
							case TORQUE3:// {1} NM ( {2} LB FT)
							case RPM: // {1} RPM
							
							case MISC: // {1} Unit

								noteLine = split[1].trim() + " ";

								for (int i = 2; i < split.length; i++) {

									attribInternalName = split[i].trim();
									value = partAttributeMap
											.containsKey(attribInternalName) ? partAttributeMap
											.get(attribInternalName).trim()
											: " ";

									noteLine = noteLine.replace(
											positionMap.get(i - 1), value);

								}
								LOGGER.debug(noteLine);

								itemNote.append(noteLine + NEW_LINE);
								break;

							/**
							 * Extra Notes Field - Additional Lines specific to
							 * each Template.
							 **/
							case EXTRA:

								value = CumminsItemNoteUtils
										.getExtraNoteText(partAttributeMap);
								if (value != null) {

									StringBuilder note = formatNote(value,
											lineCounter);
									itemNote.append(note);
								}
								break;

							default:
								LOGGER.debug("Invalid Prefix :" + prefix);
								break;

							}

						} catch (Exception e) {
							LOGGER.error("Exception reading Item Note Template");
							LOGGER.error(e);
							itemNote.append(NEW_LINE);
						}

					}

					LOGGER.debug("CumminsItemNotePopulation.populateItemNote() : "
							+ targetPart.getNumber() + " >>\n" + itemNote);

					if (itemNote.length() > 0 && itemNote.length() <= CumminsItemNoteConstantIF.NOTE_ATTRIBUTE_LIMIT) {
						// Populate the Note Attribute on Part

						String msg = CumminsItemNoteUtils.writeItemNote(
								targetPart, itemNote);
						retunMessage.append((msg != null) ? msg : "");

					}
				}
			}
			// Condition for Free Note
			else {

				int lineCounter = 1;
				String value = CumminsItemNoteUtils
						.getFreeNoteText(partAttributeMap);
				if (value != null) {

					StringBuilder note = formatNote(value, lineCounter);
					itemNote.append(note);
				}

				LOGGER.debug("CumminsItemNotePopulation.populateItemNote() : "
						+ targetPart.getNumber() + " >>\n" + itemNote);

				if (itemNote.length() > 0 && itemNote.length() <= CumminsItemNoteConstantIF.NOTE_ATTRIBUTE_LIMIT) {
					// Populate the Note Attribute on Part

					String msg = CumminsItemNoteUtils.writeItemNote(targetPart,
							itemNote);
					retunMessage.append(msg);

				}
			}

		} catch (WTException ex) {
			LOGGER.error("Exception in Item Note Population : "
					+ targetPart.getNumber());
			LOGGER.error(ex);

		} catch (RemoteException e) {
			LOGGER.error("Exception in fetching attributes from Part"
					+ targetPart.getNumber());
			LOGGER.error(e);
		}

		LOGGER.debug("Exit >> populateItemNote()");

		if (PERF_ENABLE) {
			long customET = System.currentTimeMillis();
			LOGGER_PERF.info("Custom-Code >> TOTAL-Time >> "
					+ (customET - customST));
		}

		return retunMessage.toString();
	}

	/**
	 * Formats the Free Note / Extra Note
	 * 
	 *
	 * @param value
	 * @param lineCounter
	 * @return
	 */
	public static StringBuilder formatNote(String value, int lineCounter) {

		StringBuilder note = new StringBuilder();

		String[] lines = value.split("(?<=\\G.{"
				+ CumminsItemNoteConstantIF.EXTRA_NOTE_WIDTH + "}|\n)");

		for (String line : lines) {
			if (line.replaceAll(R_TRIM,"").length() > 0) {
				note.append(String.format("%03d", lineCounter) + SEPERATOR_PIPE
						+ line.replaceAll(R_TRIM,"") + NEW_LINE);
				lineCounter += 1;
			}
		}

		return note;

	}

	/**
	 * This method checks whether a String contains an integer value.
	 * 
	 * @param value
	 * @return
	 */
	private static String getSplitLines(String[] range, List<String> values) {

		StringJoiner noteLine = new StringJoiner(",");

		LOGGER.debug("CumminsItemNotePopulation.getSplitLines() >> START");

		try {
			int start = Integer.parseInt(range[1].trim());
			int end = Integer.parseInt(range[2].trim());

			end = values.size() > end ? end : values.size();

			for (int i = start - 1; i < end; i++) {
				String value = values.get(i);

				// Get Display Values if Enum
				value = value.contains("_") ? CumminsIBAHelper
						.getEnumerationPropDisplayValue(value) : value;

				noteLine.add(value);

			}

		} catch (Exception e) {
			LOGGER.error("CumminsItemNotePopulation.getSplitLines() >> " + e);

		}

		LOGGER.debug("CumminsItemNotePopulation.getSplitLines() >> END");

		return noteLine.toString();
	}

	/**
	 *
	 * @param args
	 * @param argument
	 * @return argument value
	 */
	private static String getStringArgument(String[] args, String argument) {
		String strArgument = null;
		if (args == null) {
			return strArgument;
		}
		for (int i = 0; i < args.length; i++) {
			String str = args[i];
			if ((str.equalsIgnoreCase(argument)) && (i + 1 < args.length)) {
				strArgument = args[i + 1];
			}
		}
		return strArgument;
	}

	/**
	 * Method invoked from Change Activity after CA 1 completes the Task (for configured Product)
	 * 
	 * 
	 * @param object
	 * @return
	 */
	public static String startItemNotePopulationForConfigProduct(WTObject object) {

		long customST = 0;
		if (PERF_ENABLE) {
			customST = System.currentTimeMillis();
			LOGGER_PERF.info("Custom-Code >> START-Time >> " + customST);
		}

		StringBuffer retunMessage = new StringBuffer();
		WTChangeActivity2 changeActivity = null;
		try {
			QueryResult result = new QueryResult();
			if (object instanceof WTChangeActivity2) {
				changeActivity = (WTChangeActivity2) object;

				long ootbST = 0;
				if (PERF_ENABLE) {
					ootbST = System.currentTimeMillis();
					LOGGER_PERF.info("OOTB-Code >> START-Time >> " + ootbST);
				}
				result = ChangeHelper2.service
						.getChangeablesAfter(changeActivity);
				if (PERF_ENABLE) {
					long ootbET = System.currentTimeMillis();
					LOGGER_PERF.info("OOTB-Code >> TOTAL-Time >> "
							+ (ootbET - ootbST));
				}
			}

			List<WTPart> parts = new ArrayList<WTPart>();

			while (result.hasMoreElements()) {
				Object obj = result.nextElement();
				if (obj instanceof WTPart) {

					if (CumminsUtils.isConfiguredProduct((WTPart) obj)) {

						WTPart part = (WTPart) obj;
						parts.add(part);

					}
				}
			}

			for (WTPart part : parts) {
				// populating Item Note for each part.

				String message = populateItemNote(part);

				if (!"".equalsIgnoreCase(message) || !message.isEmpty()) {
					retunMessage.append(part.getNumber() + "\n");
				}

			}

		} catch (Exception e) {
			String objIdentity = changeActivity != null ? "Change Activity: "
					+ changeActivity.getNumber() : "Object is null";
			Object[] arrayOfObject = { objIdentity, e.getLocalizedMessage() };
			WTMessage feedMsg = new WTMessage(RESOURCE,
					CumminsItemNoteResource.ITEM_NOTE_RELEASE_ERROR,
					arrayOfObject);
			retunMessage.append(feedMsg);
			LOGGER.error(feedMsg.getLocalizedMessage(), e);
		}

		if (PERF_ENABLE) {
			long customET = System.currentTimeMillis();
			LOGGER_PERF.info("Custom-Code >> TOTAL-Time >> "
					+ (customET - customST));
		}
		return retunMessage.toString();
	}

	public static String populateItemNote(WTPart targetPart) throws WTException {
    long customST = 0;
    if (PERF_ENABLE) {
        customST = System.currentTimeMillis();
        LOGGER_PERF.info("Custom-Code >> START-Time >> " + customST);
    }

    // Formating for Item Note starts
    LOGGER.debug("CumminsItemNotePopulation.populateItemNote() >>"
            + targetPart.getNumber());

    LOGGER.debug("Enter >> populateItemNote()");

    StringBuilder retunMessage = new StringBuilder();
    StringBuilder itemNote = new StringBuilder();
    List<String> template;
    String primaryClassification = "";

    if (WorkInProgressHelper.isCheckedOut(targetPart)) {
        throw new WTException("The Part [" + targetPart.getNumber()
                + "] is checked out");
    }

    // **New Logic: Check if part type is Option Part and status is Pending Obsolete**
    String partType = targetPart.getType().getName(); // Retrieve part type
    String partStatus = targetPart.getLifeCycleState().getName(); // Retrieve part lifecycle state

    if ("Option Part".equalsIgnoreCase(partType) && "Pending Obsolete".equalsIgnoreCase(partStatus)) {
        LOGGER.info("Skipping Item Note population for part " + targetPart.getNumber()
                + " as it is an Option Part with Pending Obsolete status.");
        return "Item Note population skipped for Option Part with Pending Obsolete status.";
    }

    try {
        // Get all Attributes of Part
        Map<String, String> partAttributeMap = CumminsIBAHelper
                .getAllValue(targetPart);

        // Fetch Primary Classification of Part
        primaryClassification = partAttributeMap
                .containsKey(CumminsPartConstantIF.PRIMARY_CLASSIFICATION) ? partAttributeMap
                .get(CumminsPartConstantIF.PRIMARY_CLASSIFICATION)
                : primaryClassification;

        LOGGER.error("Test");

        // Checking if Item Note Classification
        if (primaryClassification
                .contains(CumminsItemNoteConstantIF.NOTE_PREFIX)) {

            // Read the Item Note Template
            template = CumminsItemNoteUtils
                    .getTemplate(primaryClassification);

            LOGGER.error(template);

            int lineCounter = 0;
            if (!template.isEmpty()) {
                for (String line : template) {
                    try {
                        lineCounter += 1;
                        String[] split = line.split(SEPERATOR_HASH_REGEX);
                        String prefix = split[0].trim();
                        String noteLine;
                        String value;
                        String attribInternalName;

                        // Start New Code

                        switch (prefix) {

                            // Other cases...

                            default:
                                LOGGER.debug("Invalid Prefix :" + prefix);
                                break;
                        }

                    } catch (Exception e) {
                        LOGGER.error("Exception reading Item Note Template");
                        LOGGER.error(e);
                        itemNote.append(NEW_LINE);
                    }

                }

                LOGGER.debug("CumminsItemNotePopulation.populateItemNote() : "
                        + targetPart.getNumber() + " >>\n" + itemNote);

                if (itemNote.length() > 0 && itemNote.length() <= CumminsItemNoteConstantIF.NOTE_ATTRIBUTE_LIMIT) {
                    // Populate the Note Attribute on Part
                    String msg = CumminsItemNoteUtils.writeItemNote(
                            targetPart, itemNote);
                    retunMessage.append((msg != null) ? msg : "");
                }
            }
        }
        // Condition for Free Note
        else {

            int lineCounter = 1;
            String value = CumminsItemNoteUtils
                    .getFreeNoteText(partAttributeMap);
            if (value != null) {

                StringBuilder note = formatNote(value, lineCounter);
                itemNote.append(note);
            }

            LOGGER.debug("CumminsItemNotePopulation.populateItemNote() : "
                    + targetPart.getNumber() + " >>\n" + itemNote);

            if (itemNote.length() > 0 && itemNote.length() <= CumminsItemNoteConstantIF.NOTE_ATTRIBUTE_LIMIT) {
                // Populate the Note Attribute on Part

                String msg = CumminsItemNoteUtils.writeItemNote(targetPart,
                        itemNote);
                retunMessage.append(msg);
            }
        }

    } catch (WTException ex) {
        LOGGER.error("Exception in Item Note Population : "
                + targetPart.getNumber());
        LOGGER.error(ex);

    } catch (RemoteException e) {
        LOGGER.error("Exception in fetching attributes from Part"
                + targetPart.getNumber());
        LOGGER.error(e);
    }

    LOGGER.debug("Exit >> populateItemNote()");

    if (PERF_ENABLE) {
        long customET = System.currentTimeMillis();
        LOGGER_PERF.info("Custom-Code >> TOTAL-Time >> "
                + (customET - customST));
    }

    return retunMessage.toString();
}

}
