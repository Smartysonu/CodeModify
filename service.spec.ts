import java.util.*;
import com.google.common.collect.Multimap;
import com.google.common.collect.Multiset;
import com.google.common.collect.ArrayListMultimap;

public class PartCheckUtil {

    public static boolean checkIfSupersedingPart(String attrInternalName, String attrValue) {
        boolean isPartSup = false;
        System.out.println("Cummins util attrInternalName->");
        System.out.println("attrInternalName: " + attrInternalName);
        System.out.println(" and attrValue: " + attrValue);
        
        try {
            Class<?> indexPart = WTPart.class;
            Class<?> indexStringValue = wt.iba.value.StringValue.class;
            Class<?> indexStringDefinition = wt.iba.definition.StringDefinition.class;
            Class<?> indexTypeDefinition = WTTypeDefinition.class;
            Class<?> indexTypeDefinitionMaster = WTTypeDefinitionMaster.class;
            
            QuerySpec qs1 = new QuerySpec(indexStringDefinition);
            qs1.appendSearchCondition(new SearchCondition(indexStringDefinition, "name", "=", attrInternalName));
            QueryResult qr1 = PersistenceHelper.manager.find(qs1);
            
            StringDefinition strDef = null;
            ObjectIdentifier defOID = null;
            
            while (qr1.hasMoreElements()) {
                System.out.println("qr1: " + qr1);
                strDef = (StringDefinition) qr1.nextElement();
                defOID = ((Persistable) strDef).getPersistInfo().getObjectIdentifier();
                System.out.println("Superseding part details: " + defOID + "------" + strDef);
            }
            
            QuerySpec qs2 = new QuerySpec(wt.iba.value.StringValue.class);
            qs2.appendSearchCondition(new SearchCondition(indexStringValue, "theIBAHolderReference.key.classname", SearchCondition.EQUAL, "wt.part.WTPart"));
            qs2.appendAnd();
            qs2.appendSearchCondition(new SearchCondition(indexStringValue, "definitionReference.key", SearchCondition.EQUAL, defOID));
            qs2.appendAnd();
            qs2.appendSearchCondition(new SearchCondition(indexStringValue, "value", SearchCondition.EQUAL, attrValue, false));
            
            QueryResult qr2 = PersistenceHelper.manager.find(qs2);
            wt.iba.value.StringValue strVal = null;
            QuerySpec qs3 = null;
            QueryResult qr3 = null;
            
            System.out.println("query for qs2 " + qs2);
            Multimap<String, WTPart> partList = ArrayListMultimap.create();
            
            while (qr2.hasMoreElements()) {
                strVal = (StringValue) qr2.nextElement();
                qs3 = new QuerySpec();
                qs3.appendClassList(indexPart, true);
                qs3.appendClassList(indexTypeDefinition, false);
                qs3.appendClassList(indexTypeDefinitionMaster, false);
                
                SearchCondition sc1 = new SearchCondition(indexPart, "typeDefinitionReference.key.id", indexTypeDefinition, "thePersistInfo.theObjectIdentifier.id");
                SearchCondition sc2 = wt.vc.VersionControlHelper.getSearchCondition(indexPart, true);
                SearchCondition sc3 = new SearchCondition(indexPart, "thePersistInfo.theObjectIdentifier", SearchCondition.EQUAL, new ObjectIdentifier(strVal.getIBAHolderReference().toString()));
                
                qs3.appendWhere(sc1, 0, 1);
                qs3.appendAnd();
                qs3.appendWhere(sc2, 0);
                qs3.appendAnd();
                qs3.appendWhere(sc3, 0);
                
                qr3 = PersistenceHelper.manager.find(qs3);
                System.out.println("query qr3 " + qs3);
                System.out.println("qr3.size(): " + qr3.size());
                
                if (qr3.size() > 0) {
                    while (qr3.hasMoreElements()) {
                        Object obj = qr3.nextElement();
                        if (obj instanceof Persistable[]) {
                            for (Persistable per : (Persistable[]) obj) {
                                if (per instanceof WTPart) {
                                    partList.put(((WTPart) per).getNumber(), (WTPart) per);
                                    System.out.println("partList->" + partList);
                                }
                            }
                        } else if (obj instanceof Persistable && obj instanceof WTPart) {
                            partList.put(((WTPart) obj).getNumber(), (WTPart) obj);
                            System.out.println("partList->" + partList);
                        }
                    }
                }
                
                isPartSup = checkIfValueInLatestPart(partList);
            }
        } catch (QueryException | WTException e) {
            LOGGER.error("Querying Superseding Part failed: " + e);
        }
        
        System.out.println("query isPartSup: " + isPartSup);
        return isPartSup;
    }
    
    public static boolean checkIfValueInLatestPart(Multimap<String, WTPart> partList) throws WTException {
        boolean isPartSup = false;
        Multiset<String> partNumbers = partList.keys();
        List<WTPart> latestPartList = new ArrayList<>();
        
        for (String partNumber : partNumbers) {
            Collection<WTPart> parts = partList.get(partNumber);
            for (WTPart part : parts) {
                WTPart latestPart = getLatestPart(part);
                System.out.println("latestPart: " + latestPart);
                if (parts.stream().anyMatch(p -> p.getNumber().equals(latestPart.getNumber()))) {
                    return true;
                }
            }
        }
        return false;
    }
    
    private static WTPart getLatestPart(WTPart part) {
        // Mock method to get the latest part version
        return part; 
    }
}
